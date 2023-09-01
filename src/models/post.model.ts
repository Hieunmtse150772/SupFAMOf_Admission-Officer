
type PostCreated = {
    postTitleId: 0, //completetext box 
    postDescription: string,
    dateFrom: string,
    dateTo: string,
    timeFrom: string, //00:00:00 
    timeTo: string,
    priority: number | null, //độ ưu tiên 1-5, defaultvalue: 0
    isPremium: boolean, // false
    location: string,
    postPositions: PositionI[],
    trainingPositions: TrainingPositionsI[]
}
export type PositionI = {
    positionName: string,
    amount: number | null,
    salary: number | null
}
export type TrainingPositionsI = {
    positionName: string,
    amount: number | null,
    salary: number | null
}
export default PostCreated