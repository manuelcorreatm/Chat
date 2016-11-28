class ChatCtrl {
    public user: chat.User;
    private users: [chat.User];
    private contacts: any;
    public conversations: any;
    public selectedContact: chat.Contact;
    public selectedConversation: chat.Conversation;
    public selectedUsers: chat.Contact[];

    static $inject = ["$scope", "$mdSidenav", "$location", "userService", "$http"];
    constructor(
        private $scope: angular.IScope,
        private $mdSidenav: angular.material.ISidenavService,
        private $location: angular.ILocationService,
        private userService: chat.UserService,
        private $http: angular.IHttpService
    ) {
        this.user = userService.getUser();
        this.loadContacts();
        this.loadUsers();
        this.loadConversations();
        this.selectedUsers = [];
    }

    /* TOOLBAR */
    logout() {
        this.userService.logout()
            .then((data: any) => {
                this.$location.path("/");
            });
    }

    toggleSidebar() {
        this.$mdSidenav('left').toggle();
    }

    /* AUTOCOMPLETE CHIPS */
    loadUsers() {
        this.$http.get("/users/" + this.user._id)
            .then((response: angular.IHttpPromiseCallbackArg<[chat.User]>) => {
                this.users = response.data;
            });
    }

    getMatches(query: string) {
        return query ? this.users.filter(this.createFilterFor(query)) : [];
    }

    private createFilterFor(query: string) {
        var uppercaseQuery = angular.uppercase(query);
        return function filterFn(user: chat.User) {
            return (user.name.toUpperCase().indexOf(uppercaseQuery) === 0);
        };
    }

    /* ADD CONTACT */
    addContact() {
        var updateMongo = false;
        var contacts: chat.Contact[] = [];
        for (let user of this.selectedUsers) {
            if (!this.contacts[user._id]) {
                updateMongo = true;
                let contact = {
                    _id: user._id,
                    name: user.name,
                    avatar: user.avatar,
                    email: user.email
                };
                contacts.push(contact);
                this.user.contacts.push(contact);
                this.contacts[contact._id] = contact;
            }
        }
        if (updateMongo) {
            //UPDATE MONGO
            this.$http.post("/users/" + this.user._id + "/contacts", { contacts })
                .then((response: angular.IHttpPromiseCallbackArg<chat.User>) => {
                    console.log("contact added");
                });
        }
        this.selectedUsers = [];
    }

    /* ADD CONVERSATION */
    createConversation() {
        if (this.selectedUsers.length === 1) {
            if (this.conversations[this.selectedUsers[0]._id]) {
                this.selectedConversation = this.conversations[this.selectedUsers[0]._id];
            } else {
                let contact = {
                    _id: this.selectedUsers[0]._id,
                    name: this.selectedUsers[0].name,
                    avatar: this.selectedUsers[0].avatar,
                    email: this.selectedUsers[0].email
                };
                let user = {
                    _id: this.user._id,
                    name: this.user.name,
                    avatar: this.user.avatar,
                    email: this.user.email
                };
                let conversation: chat.Conversation = {
                    _id: undefined,
                    users: [contact, user],
                    messages: [],
                    type: "single"
                };
                //UPDATE MONGO
                this.$http.post("/conversations/", conversation)
                    .then((response: angular.IHttpPromiseCallbackArg<chat.Conversation>) => {
                        console.log("conversation added");
                        let convo = response.data;
                        convo.uid = contact._id;
                        convo.name = contact.name;
                        convo.avatar = contact.avatar;
                        this.conversations[convo.uid] = convo;
                        this.selectedConversation = this.conversations[contact._id];
                    }, (reason) => {
                        console.log(reason);
                    });
            }
        } else if (this.selectedUsers.length > 1) {
            let names: string[] = [];
            let contacts: chat.Contact[] = [];
            let user = {
                _id: this.user._id,
                name: this.user.name,
                avatar: this.user.avatar,
                email: this.user.email
            };
            contacts.push(user);
            for (let user of this.selectedUsers) {
                names.push(user.name);
                let contact: chat.Contact = {
                    _id: user._id,
                    name: user.name,
                    avatar: user.avatar,
                    email: user.email
                };
                contacts.push(contact);
            }
            let conversation: chat.Conversation = {
                _id: undefined,
                name: names.join(", "),
                avatar: "/assets/img/ghosty.png",
                users: contacts,
                messages: [],
                type: "group"
            }
            //UPDATE MONGO
            this.$http.post("/conversations/", conversation)
                .then((response: angular.IHttpPromiseCallbackArg<chat.Conversation>) => {
                    console.log("conversation added");
                    this.conversations[conversation._id] = conversation;
                    this.selectedConversation = this.conversations[conversation._id];
                });
        }
        this.selectedUsers = [];
    }

    /* CONTACT LIST */
    private loadContacts() {
        this.contacts = {};
        for (let contact of this.user.contacts) {
            this.contacts[contact._id] = contact;
        }
    }
    selectContact(contact: chat.Contact) {
        this.selectedContact = contact;
        if (this.conversations[contact._id]) {
            this.selectedConversation = this.conversations[contact._id];
        } else {
            //create it
            this.selectedUsers = [contact];
            this.createConversation();
        }
    }

    /* CONVERSATION LIST */
    private loadConversations() {
        this.$http.get("/conversations/" + this.user._id)
            .then((response: angular.IHttpPromiseCallbackArg<[chat.Conversation]>) => {
                this.conversations = {};
                console.log(response.data);
                for (let convo of response.data) {
                    if (convo.type === "single") {
                        for (let user of convo.users) {
                            if (user._id != this.user._id) {
                                convo.uid = user._id;
                                convo.name = user.name;
                                convo.avatar = user.avatar;
                            }
                        }
                    } else {
                        convo.uid = convo._id;
                    }
                    this.conversations[convo.uid] = convo;
                }

            });
    }

    selectConversation(conversation: chat.Conversation) {
        this.selectedConversation = conversation;
    }

}

angular.module("chatApp")
    .controller("chatCtrl", ChatCtrl);