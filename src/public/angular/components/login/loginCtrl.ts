class LoginCtrl {
    public name: string;
    public email: string;
    public pass: string;
    public rightButton: string;
    public isRegistering: boolean;

    static $injector = ["$scope", "$location", "$http", "userService"];
    constructor(
        private $scope: angular.IScope,
        private $location: angular.ILocationService,
        private $http: angular.IHttpService,
        private userService: chat.UserService
    ) {
        this.rightButton = "Register";
        this.isRegistering = false;
    }

    loginFacebook() {
        this.userService.loginFb()
            .then((user: chat.User) => {
                this.$location.path("/chat");
            });
    }

    loginEmail() {
        var loginData = {
            email: this.email,
            password: this.pass
        }
        this.userService.loginEmail(loginData)
            .then((user: chat.User) => {
                this.$location.path("/chat");
            });
    }

    toggleRegister() {
        if (this.isRegistering) {
            this.rightButton = "Register";
            this.isRegistering = false;
        } else {
            this.rightButton = "Cancel";
            this.isRegistering = true;
        }
    }

    signUp() {
        var signupData = {
            email: this.email,
            password: this.pass,
            name: this.name
        }
        this.userService.signUp(signupData)
            .then((user: chat.User) => {
                this.$location.path("/chat");
            });
    }
}

angular.module("chatApp")
    .controller("loginCtrl", LoginCtrl);
