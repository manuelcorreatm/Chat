declare module 'chat' {
    export = chat;
}

declare namespace chat {
    export interface Contact {
        email: string,
        name: string,
        avatar: string
    }

    export interface User {
        _id: any,
        email: string,
        name: string,
        avatar: string,
        facebook: {
            id: string,
            email: string,
        },
        contacts: [Contact]
    }



    export interface LoginData {
        email: string,
        password: string
    }

    export interface SignupData {
        email: string,
        password: string,
        name: string
    }

    export interface Conversation {
        name: string,
        avatar: string,
        users: [{
            email: string,
            name: string,
            avatar: string
        }],
        messages: [{
            email: string,
            name: string,
            avatar: string,
            message: string
        }]
    }

    export interface UserService {
        loginFb(): angular.IPromise<User>;
        loginEmail(data: LoginData): angular.IPromise<User>;
        signUp(data: SignupData): angular.IPromise<User>;
        getUser(): User;
        authenticate(): angular.IPromise<string>;
        logout(): angular.IPromise<User>;
    }
}