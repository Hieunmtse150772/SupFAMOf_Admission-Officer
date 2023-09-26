
type PostCreated = {
    postTitleId: 0, //completetext box 
    postDescription: string,
    dateFrom: Date | string,
    dateTo: Date | string,
    timeFrom: Date | string, //00:00:00 
    timeTo: Date | string,
    priority: number | null, //độ ưu tiên 1-5, defaultvalue: 0
    isPremium: boolean, // false
    location: string,
    postPositions: PositionCreatedI[],
    trainingPositions: TrainingPositionsCreatedI[]
}
export type PositionCreatedI = {
    positionName: string,
    amount: number | null,
    salary: number | null
}
export type TrainingPositionsCreatedI = {
    positionName: string,
    amount: number | null,
    salary: number | null
}
export default PostCreated