import * as angular from "angular";
import uiRouter from "angular-ui-router";
import { appComponent } from "./app.component";

export const app = angular
    .module("common.app", [
        uiRouter
    ])
    .component("app", appComponent)
    .config(($stateProvider: angular.ui.IStateProvider) => {
        $stateProvider
            .state("app", {
                // redirectTo: "contacts",
                url: "/app",
                data: {
                    requiredAuth: true
                },
                component: "app"
            });
    })
    .name;