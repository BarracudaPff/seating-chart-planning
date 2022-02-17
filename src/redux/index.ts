export interface Action<T> {
    type: string | number;
    payload: T;
}

export interface AppState {
    user: UserState
    // system: SystemState
    // navigation: NavigatorState
    // auth: AuthState
}

export interface UserInfoProps {
    provider: string
    uid: number | undefined
    username: string
    password: string
    loginName: string
    avatarUrl: string
    email: string
    role: string
    token: string | undefined
    bio: string
    location: string
    createdAt: string
}

export interface UserState {
    isLogin: boolean
    isLockScreen: boolean
    userInfo?: UserInfoProps
}

export interface SystemState {
    info: {
        mysqlVersion: string
        currentSystemTime: number
        freemem: number
        totalmem: number
        platform: string
        type: string
        hostname: string
        arch: string
        nodeVersion: string
        cpus: any[]
    }
}
