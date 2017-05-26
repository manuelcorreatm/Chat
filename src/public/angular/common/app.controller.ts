export class AppController {
    static $inject: string[] = ["AuthService", "$state"];
    constructor(
        private authService: any,
        private $state: any
    ) {
        this.user = authService.getUser();
    }

    logout() {
        return this.authService
            .logout()
            .then(() => {
                return this.$state.go("auth.login");
            });
    }
}