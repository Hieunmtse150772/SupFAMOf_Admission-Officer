export type BanParamsI = {
    accountIdBanned: number,
    dayEnd: Date | string,
    note: string
}
export type UnBanParamsI = {
    accountIdBanned: number,
    note: string,
    isActive: boolean
}