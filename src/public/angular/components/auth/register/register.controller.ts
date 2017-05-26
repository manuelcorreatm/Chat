export class RegisterController {
    static $inject: string[] = ["AuthService", "$state"];
    constructor(
        private authService: any,
        private $state: any
    ) { }

    $onInit() {
        this.error = null;
        this.signupData = {
            name: '',
            email: '',
            password: '',
        };
    }

    createUser(event: any) {
        return this.authService
            .register(event.signupData)
            .then(() => {
                this.$state.go('app');
            }, (reason: any) => {
                this.error = reason.message;
            });
    }
}