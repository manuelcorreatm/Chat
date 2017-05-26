export class AuthService {
    static $inject = ["$http", "$q"];

    private user: chat.User;

    constructor(
        private $http: angular.IHttpService,
        private $q: angular.IQService
    ) {
    }

    login(loginData: chat.LoginData): angular.IPromise<undefined> {
        var deferred = this.$q.defer();
        this.$http.post("/login", loginData)
            .then((response: angular.IHttpPromiseCallbackArg<chat.User>) => {
                this.user = response.data;
                deferred.resolve();
            }, (reason: any) => {
                deferred.reject(reason);
            });
        return deferred.promise;
    }

    register(signupData: chat.SignupData): angular.IPromise<undefined> {
        var deferred = this.$q.defer();
        this.$http.post("/signup", signupData)
            .then((response: angular.IHttpPromiseCallbackArg<chat.User>) => {
                this.user = response.data;
                deferred.resolve();
            }, (reason: any) => {
                deferred.reject(reason);
            });
        return deferred.promise;
    }

    logout(): angular.IPromise<undefined> {
        var deferred = this.$q.defer();
        this.$http.get("/logout")
            .then((data) => {
                this.user = undefined;
                deferred.resolve();
            }, (reason) => {
                deferred.reject(reason);
            });
        return deferred.promise;
    }

    requireAuthentication() {
        var deferred = this.$q.defer();
        if (!!this.user) {
            deferred.resolve();
        } else {
            deferred.reject("not authenticated");
        }
        return deferred.promise;
    }

    isAuthenticated() {
        return !!this.user;
    }

    getUser(): chat.User {
        if (this.user) {
            return this.user;
        }
    }
}