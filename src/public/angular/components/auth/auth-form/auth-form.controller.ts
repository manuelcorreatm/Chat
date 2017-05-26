import * as angular from "angular";
export class FormComponent {
    private loginData: chat.LoginData;
    constructor() {
        'ngInject';
    }

    $onChanges(changes: any) {
        if (changes.loginData) {
            this.loginData = angular.copy(this.loginData);
        }
    }

    submitForm() {
        this.onSubmit({
            $event: {
                loginData: this.loginData,
            },
        });
    }
}