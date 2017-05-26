export class LoginController {
    static $inject: string[] = ["AuthService"];

    constructor(
        private authService: any,
        private $state: any
    ) { }

    $onInit() {
        this.error = null;
        this.loginData = {
            email: "",
            password: ""
        };
    }

    loginUser(event: any) {
        return this.authService
            .login(event.loginData)
            .then(() => {
                this.$state.go("app");
            }, (reason: any) => {
                this.error = reason.message;
            });
    }
}