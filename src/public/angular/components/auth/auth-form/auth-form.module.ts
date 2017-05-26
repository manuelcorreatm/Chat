import * as angular from "angular";
import { formComponent } from "./auth-form.component.ts";

export const authForm = angular
    .module("components.auth.auth-form", [])
    .component("authForm", formComponent)
    .name;