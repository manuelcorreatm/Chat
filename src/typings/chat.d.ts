declare module 'chat' {
    export = chat;
}

declare namespace chat {
    export interface Contact {
        _id: string,
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
        _id: any,
        name?: string,
        avatar?: string,
        users: Contact[],
        messages: { sender: Contact, message: string }[],
        type: string,
        uid?: string
    }

    export interface LoginFbService {
        login(): angular.IPromise<chat.User>;
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