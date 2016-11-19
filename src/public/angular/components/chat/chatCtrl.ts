class ChatCtrl {
    public user: chat.User;
    public users: [chat.User];
    public selectedContact: chat.Contact;
    public selectedConversation: chat.Conversation;

    static $inject = ["$scope", "$mdSidenav", "$location", "userService", "$http"];
    constructor(
        private $scope: angular.IScope,
        private $mdSidenav: angular.material.ISidenavService,
        private $location: angular.ILocationService,
        private userService: chat.UserService,
        private $http: angular.IHttpService
    ) {
        this.user = userService.getUser();
        this.loadUsers();
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

    /* AUTOCOMPLETE */
    loadUsers() {
        this.$http.get("/users")
            .then((response: angular.IHttpPromiseCallbackArg<[chat.User]>) => {
                this.users = response.data;
            });
    }

    getMatches(query: string) {
        var results = query ? this.users.filter(this.createFilterFor(query)) : this.users;
        return results;
    }

    private createFilterFor(query: string) {
        var uppercaseQuery = angular.uppercase(query);
        return function filterFn(user: chat.User) {
            return (user.name.toUpperCase().indexOf(uppercaseQuery) === 0);
        };
    }

    /* CONTACT LIST */
    selectContact(contact: chat.Contact) {
        this.selectedContact = contact;
    };

    /* CONVERSATION LIST */
    private loadConversations() {
        this.$http.get("/conversations/" + this.user._id)
            .then(function (response: angular.IHttpPromiseCallbackArg<[chat.User]>) {
                this.users = response.data;
            });
    }

    selectConversation(conversation: chat.Conversation) {
        this.selectedConversation = conversation;
    };
}

angular.module("chatApp")
    .controller("chatCtrl", ChatCtrl);