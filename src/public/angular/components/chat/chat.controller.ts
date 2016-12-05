class ChatCtrl {
    public user: chat.User;
    public conversations: chat.Conversations;
    public selectedContact: chat.Contact;
    public selectedConversation: chat.Conversation;
    public selectedUsers: chat.Contact[];
    public message: string;

    private users: [chat.User]; //replace this with async call to search for users
    private contacts: chat.Contacts; //Object with all the user's contacts <id, contact>
    private usersXconversations: chat.UsersXConversations; //Object with relationship between contact and conversation <contactid, conversationid>
    private usersInGroup: chat.Contacts; //Object with all the users in the selected group <id, user>

    static $inject = ["$scope", "$mdSidenav", "$location", "userService", "$http", "socketIO", "$timeout"];
    constructor(
        private $scope: angular.IScope,
        private $mdSidenav: angular.material.ISidenavService,
        private $location: angular.ILocationService,
        private userService: chat.UserService,
        private $http: angular.IHttpService,
        private socketIO: chat.Socket,
        private $timeout: angular.ITimeoutService
    ) {
        this.user = userService.getUser();
        this.loadContacts();
        this.loadUsers();
        this.loadConversations();
        this.selectedUsers = [];

        this.socketIO.connect();
        this.socketIO.on("connect", () => {
            console.log("client connected to io");
            this.joinConversation(this.user._id);
            this.socketIO.on("new:message", (message: chat.Message) => {
                this.conversations[message.conversation].messages.push(message);
                if (this.selectedConversation && this.selectedConversation._id === message.conversation) {
                    this.updateChatWindow();
                }
            });
            this.socketIO.on("add:conversation", (conversation: chat.Conversation) => {
                let names: string[] = [];
                if (this.conversations[conversation._id]) {
                    return;
                }
                for (let user of conversation.users) {
                    if (user.name !== this.user.name) {
                        names.push(user.name);
                        if (conversation.type === "single") {
                            conversation.avatar = user.avatar;
                        }
                    }
                }
                conversation.name = names.join(", ");
                this.conversations[conversation._id] = conversation;
                this.joinConversation(conversation._id);
            });
            this.socketIO.on("refresh:contacts", () => {
                this.refreshContacts();
            });
        });
    }

    private refreshContacts() {
        this.$http.get("/users/" + this.user._id + "/contacts")
            .then((response: angular.IHttpPromiseCallbackArg<[chat.Contact]>) => {
                this.user.contacts = response.data;
                this.loadContacts();
            });
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
                    this.socketIO.emit("update:contacts", contacts);
                });
        }
        this.selectedUsers = [];
    }

    /* ADD CONVERSATION */
    createConversation() {
        if (this.selectedUsers.length === 1) {
            if (this.usersXconversations[this.selectedUsers[0]._id]) {
                this.selectedConversation = this.conversations[this.usersXconversations[this.selectedUsers[0]._id]];
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
                        convo.name = contact.name;
                        convo.avatar = contact.avatar;
                        this.conversations[convo._id] = convo;
                        this.selectConversation(this.conversations[convo._id]);
                        this.usersXconversations[contact._id] = convo._id;
                        this.joinConversation(convo._id);
                        this.socketIO.emit("create:conversation", response.data);
                    }, (reason) => {
                        console.log(reason);
                    });
            }
        } else if (this.selectedUsers.length > 1) {
            let names: string[] = [];
            let contacts: chat.Contact[] = [];
            contacts.push({ //this user
                _id: this.user._id,
                name: this.user.name,
                avatar: this.user.avatar,
                email: this.user.email
            });
            for (let user of this.selectedUsers) {
                names.push(user.name);
                contacts.push(user);
            }
            let conversation: chat.Conversation = {
                _id: undefined,
                avatar: "/assets/img/ghosty.png",
                users: contacts,
                messages: [],
                type: "group"
            }
            //UPDATE MONGO
            this.$http.post("/conversations/", conversation)
                .then((response: angular.IHttpPromiseCallbackArg<chat.Conversation>) => {
                    console.log("conversation added");
                    let convo = response.data;
                    convo.name = names.join(", ");
                    this.conversations[convo._id] = convo;
                    this.selectConversation(this.conversations[convo._id]);
                    this.joinConversation(convo._id);
                    this.socketIO.emit("create:conversation", response.data);
                });
        }
        this.selectedUsers = [];
    }

    private joinConversation(conversationid: string) {
        this.socketIO.emit("join", conversationid);
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
        if (this.conversations[contact.conversation]) {
            this.selectedConversation = this.conversations[contact.conversation];
        } else {
            //create it
            this.selectedUsers = [contact];
            this.createConversation();
        }
    }

    /* CONVERSATION LIST */
    private loadConversations() {
        this.conversations = {};
        this.usersXconversations = {};
        this.$http.get("/users/" + this.user._id + "/conversations")
            .then((response: angular.IHttpPromiseCallbackArg<[chat.Conversation]>) => {
                this.conversations = {};
                for (let convo of response.data) {
                    let names: string[] = [];
                    for (let user of convo.users) {
                        if (user._id != this.user._id) {
                            names.push(user.name);
                            if (convo.type === "single") {
                                convo.avatar = user.avatar;
                                this.usersXconversations[user._id] = convo._id;
                            }
                        }
                    }
                    convo.name = names.join(", ");
                    this.conversations[convo._id] = convo;
                    this.joinConversation(convo._id);
                }
            });
    }

    selectConversation(conversation: chat.Conversation) {
        this.usersInGroup = {};
        this.selectedConversation = conversation;
        if (conversation.type === "group") {
            for (let user of conversation.users) {
                this.usersInGroup[user._id] = user;
            }
        }
        this.updateChatWindow();
    }

    /* CHAT TOOLBAR */
    addUserToConversation() {
        var updateMongo = false;
        var users: chat.Contact[] = [];
        for (let user of this.selectedUsers) {
            if (!this.usersInGroup[user._id]) {
                updateMongo = true;
                users.push(user);
                this.selectedConversation.name += ", " + user.name;
                this.selectedConversation.users.push(user);
                this.usersInGroup[user._id] = user;
            }
        }
        if (updateMongo) {
            //UPDATE MONGO
            this.$http.post("/conversations/" + this.selectedConversation._id + "/users", { users })
                .then((response: angular.IHttpPromiseCallbackArg<chat.Conversation>) => {
                    console.log("user added to conversation");
                    this.socketIO.emit("join:group", response.data);
                });
        }

        this.selectedUsers = [];
    }

    /* CHAT WINDOW */
    sendMessage() {
        var message = {
            sender: {
                _id: this.user._id,
                name: this.user.name,
                avatar: this.user.avatar,
                email: this.user.email
            },
            message: this.message
        };

        this.socketIO.emit("send:message", {
            conversation: this.selectedConversation._id,
            sender: message.sender,
            message: message.message
        });

        this.selectedConversation.messages.push(message);
        this.message = "";

        this.updateChatWindow();

        this.$http.post("/conversations/" + this.selectedConversation._id + "/messages", message);
    }

    private updateChatWindow() {
        this.$timeout(() => {
            var chatWindow = angular.element("#content");
            chatWindow.scrollTop(chatWindow[0].scrollHeight);
        }, 100);
    }
}

angular.module("chatApp")
    .controller("chatCtrl", ChatCtrl);