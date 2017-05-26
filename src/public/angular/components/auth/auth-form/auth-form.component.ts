import * as angular from "angular";
import controller from "./auth-from.controller";

export const formComponent: angular.IComponentOptions = {
    bindings: {
        loginData: "<",
        button: "@",
        message: "@",
        onSubmit: "&"
    },
    templateUrl: "./auth-form.template.html",
    controller
}