import * as angular from "angular";
import uiRouter from "angular-ui-router";
import { AuthService } from "./auth.service";
import { login } from "./login/login.module";
import { register } from "./register/register.module";
import { authForm } from "./auth-form/auth-form.module";

export const auth = angular
    .module("components.auth", [
        uiRouter,
        login,
        register,
        authForm
    ])
    .run(($transitions: any, $state: any, AuthService: any) => {

        $transitions.onStart({
            to: (state: any) => !!(state.data && state.data.requiredAuth)
        }, () => {
            return AuthService
                .requireAuthentication()
                .catch(() => $state.target("auth.login"));
        });

        $transitions.onStart({
            to: "auth.*"
        }, () => {
            if (AuthService.isAuthenticated()) {
                return $state.target("app");
            }
        });
    })
    .service("AuthService", AuthService)
    .name;