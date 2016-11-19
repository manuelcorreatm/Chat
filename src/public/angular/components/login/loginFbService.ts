export interface loginFbService {
    login(): angular.IPromise<chat.User>;
}

class LoginFbService implements loginFbService {
    static $inject = ["$rootScope", "$http", "$q"];
    constructor(private $rootScope: angular.IRootScopeService, private $http: angular.IHttpService, private $q: angular.IQService) {

    }

    login() {
        var deferred = this.$q.defer();
        FB.login((res: any) => {
            console.log(res);
            if (res.status === 'connected') {
                FB.api('/me', { fields: "name, email, picture" }, (res: any) => {
                    if (!res || res.error) {
                        console.log(res);
                        deferred.reject("error getting fb data");
                    } else {
                        console.log("connected", res);
                        let profile = {
                            id: res.id,
                            email: res.email,
                            displayName: res.name,
                            avatar: res.picture.data.url
                        }

                        this.$http.post("/auth/facebook/callback", profile)
                            .then((response: angular.IHttpPromiseCallbackArg<chat.User>) => {
                                deferred.resolve(response.data)
                            });
                    }
                });
            } else {
                deferred.reject("error: not connected to fb");
            }
        }, { scope: "public_profile, email", return_scopes: true });
        return deferred.promise;
    }
}

angular.module("chatApp")
    .service("loginFbService", LoginFbService);