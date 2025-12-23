import io from 'socket.io-client'

export class SocketService {
    socket: any | undefined
    socketUrl = ''

    private notificationFn: ((data: never) => void) | null = null

    constructor() {
        this.onConnect = this.onConnect.bind(this)
        this.onDisconnect = this.onDisconnect.bind(this)
        this.onNotification = this.onNotification.bind(this)
    }

    connect(url: string, path?: string, query?: any): void {
        if (this.socket && this.socket.connected) {
            console.warn('socket.io connection already opened')
            return
        }

        // We only take the base url to connect to the socket
        const uri = new URL(url)
        const baseUrl = uri.origin

        this.socket = io(baseUrl, {
            path,
            transports: ['websocket'],
            query: { ...query }
        })

        this.socket.on('connect', this.onConnect)
        this.socket.on('disconnect', this.onDisconnect)
    }

    disconnect(): void {
        if (!this.socket) {
            console.warn('socket.io connection not opened')
            return
        }

        if (!this.socket || !this.socket.connected) {
            return
        }

        this.socket.close()

        this.socket.off('connect')
        this.socket.off('disconnect')

        this.socket = undefined
    }

    setNotificationCallback(fn: (data: never) => void): void {
        this.notificationFn = fn
    }

    onConnect(): void {
        if (this.socket) {
            this.socket.on('notification', this.onNotification)
        }
    }

    onDisconnect(): void {
        if (this.socket) {
            this.socket.off('notification')
            this.notificationFn = null
        }
    }

    onNotification(data: never): void {
        if (this.notificationFn) {
            this.notificationFn(data)
        } else {
            console.warn(
                'SocketService: Data received, but o notification callback (notificationFn) set.'
            )
        }
    }
}

export const socketService = new SocketService()
