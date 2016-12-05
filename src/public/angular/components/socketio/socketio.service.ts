class Socket implements chat.Socket {
    private socket: SocketIOClient.Socket;
    static $inject = ["$rootScope"];
    constructor(
        private $rootScope: angular.IRootScopeService
    ) {
    }

    connect() {
        this.socket = io.connect();
    }

    on(eventName: string, callback: Function) {
        this.socket.on(eventName, (...args: any[]) => {
            this.$rootScope.$apply(() => {
                callback.apply(this.socket, args);
            });
        });
    }

    emit(eventName: string, data: any, callback?: Function) {
        this.socket.emit(eventName, data, (...args: any[]) => {
            this.$rootScope.$apply(() => {
                if (callback) {
                    callback.apply(this.socket, args);
                }
            });
        });
    }
}

angular.module("chatApp")
    .service("socketIO", Socket);