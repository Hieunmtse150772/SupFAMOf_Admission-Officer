
type PostCreated = {
    postTitleId: 0, //completetext box 
    postDescription: string,
    dateFrom: string,
    dateTo: string,
    timeFrom: string, //00:00:00 
    timeTo: string,
    priority: number, //độ ưu tiên 1-5, defaultvalue: 0
    isPremium: boolean, // false
    location: string,
    postPositions: PositionI[],
    trainingPositions: TrainingPositionsI[]
}
type PositionI = {
    position: string,
    amount: number,
    salary: number
}
type TrainingPositionsI = {
    amount: number,
    salary: number
}
export default PostCreated