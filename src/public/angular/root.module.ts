import * as angular from "angular";
import uiRouter from "angular-ui-router";
import { rootComponent } from "./root.component";
import { components } from "./components/components.module";
import { common } from "./common/common.module";
//import "./root.css";

const root = angular
    .module("root", [
        components,
        common,
        uiRouter
    ])
    .component("root", rootComponent)
    .config(($locationProvider: angular.ILocationProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
        'ngInject';

        $locationProvider.html5Mode(true);
    })
    .name;

export default root;