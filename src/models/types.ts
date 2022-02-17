export type StringMap<V> = {
    [key: string]: V
}

export type NumberMap<V> = {
    [key: number]: V
}

export type OmitTS<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export enum ReduxType {

}
