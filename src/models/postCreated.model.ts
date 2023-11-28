
type PostCreated = {
    postTitleId: number, //completetext box 
    postDescription: string,
    dateFrom: Date | string,
    dateTo: Date | string,
    timeFrom: Date | string, //numbernumber:numbernumber:numbernumber 
    timeTo: Date | string,
    priority: number | null, //độ ưu tiên 1-5, defaultvalue: number
    isPremium: boolean, // false
    location: string,
    postPositions: PositionCreatedI[],
}
export type PostUpdated = {
    postId: number,
    postCategoryId: number,
    postDescription: string,
    priority: number,
    isPremium: boolean,
    postImg: string,
    postPositions: PositionUpdated[]
}
export type PositionUpdated = {
    id: number;
    positionDescription: string,
    positionName: string,
    schoolName: string,
    location: string,
    latitude: number,
    longitude: number,
    amount: number,
    salary: number,
    trainingCertificateId: number,
    isBusService: boolean,
    documentId: number
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
export type PostCreatedV2 = {
    postCategoryId: number,
    postDescription: string,
    postImg: string,
    priority: number,
    dateFrom: Date,
    dateTo: Date,
    isPremium: true,
    postPositions: PositionCreatedV2I[],
}
export type PositionCreatedV2I = {
    date: string,
    trainingCertificateId: number,
    documentId: number,
    positionName: string,
    schoolName: string,
    location: string,
    latitude: string,
    longitude: string,
    timeFrom: {
        ticks: number
    },
    timeTo: {
        ticks: number
    },
    isBusService: true,
    amount: number,
    salary: number
}

export default PostCreated;
