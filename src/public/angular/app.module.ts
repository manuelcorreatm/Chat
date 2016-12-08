angular.module("chatApp", ["ngRoute", "ngMaterial", "ngMessages"])
    .config(function ($mdIconProvider: angular.material.IIconProvider) {
        $mdIconProvider.icon("menu", "./assets/svg/menu.svg", 24);
        $mdIconProvider.icon("addcontact", "./assets/svg/ic_person_add_black_24px.svg", 24);
        $mdIconProvider.icon("chat", "./assets/svg/ic_chat_black_24px.svg", 24);
        $mdIconProvider.icon("send", "./assets/svg/ic_send_black_24px.svg", 24);
        $mdIconProvider.icon("addgroup", "./assets/svg/ic_group_add_black_24px.svg", 24);
        $mdIconProvider.icon("draw", "./assets/svg/ic_gesture_black_24px.svg", 24);
        $mdIconProvider.icon("text", "./assets/svg/ic_text_format_black_24px.svg", 24);
        $mdIconProvider.icon("group", "./assets/svg/ic_group_black_24px.svg", 24);

    })
    .run(function ($window: angular.IWindowService) {
        $window.fbAsyncInit = function () {
            // Executed when the SDK is loaded
            FB.init({
                appId: '635915976613380',
                //channelUrl: 'components/login/channel.html',
                status: true,
                cookie: true,
                version: 'v2.4'
            });
        };

        (function (d) {
            // load the Facebook javascript SDK
            var id = 'facebook-jssdk';
            var ref = d.getElementsByTagName('script')[0];

            if (d.getElementById(id)) {
                return;
            }

            var js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/sdk.js";

            ref.parentNode.insertBefore(js, ref);

        } (document));
    })
    .controller("mainCtrl", function ($location: angular.ILocationService, userService: chat.UserService) {
        userService.authenticate()
            .then(function (userid: string) {
                if (userid) {
                    $location.path("/chat");
                }
            });
    });
