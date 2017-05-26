import * as angular from "angular";
import { auth } from "./auth/auth.module";

export const components = angular
    .module("app.components", [
        auth
    ])
    .name;