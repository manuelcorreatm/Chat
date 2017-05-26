import * as angular from "angular";
import { app } from "./app.module";
export const common = angular
    .module("app.common", [
        //imported things
        app
    ])
    .name;