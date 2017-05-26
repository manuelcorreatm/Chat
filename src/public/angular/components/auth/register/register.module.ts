import * as angular from "angular";
import uiRouter from "angular-ui-router";
import { registerComponent } from "./register.component";

export const register = angular
    .module("components.auth.register", [
        uiRouter
    ])
    .component("register", registerComponent)
    .config(($stateProvider: angular.ui.IStateProvider) => {
        $stateProvider
            .state("auth.register", {
                url: "/register",
                component: "register"
            });
    })
    .name;