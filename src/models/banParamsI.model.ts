export type BanParamsI = {
    accountIdBanned: number,
    dayEnd: Date | string,
    note: string
}
export type UnBanParamsI = {
    accountBannedId: number,
    note: string,
    isActive: boolean
}