
type Post = {
    accountId: number,
    postTitleId: number,
    postCode: string,
    postDescription: string,
    dateFrom: string,
    dateTo: string,
    timeFrom: string,
    timeTo: string,
    priority: number,
    isPremium: boolean,
    location: string,
    attendanceComplete: boolean,
    isActive: true,
    isEnd: false,
    createAt: string,
    updateAt: string,
    account: {
        id: number,
        roleId: number,
        accountInformationId: number,
        name: string,
        email: string,
        phone: string,
        dateOfBirth: string,
        imgUrl: string,
        postPermission: boolean,
        isPremium: boolean,
        isActive: boolean,
        createAt: string,
        updateAt: string,
        accountMonthlyReport: {
            totalPost: number,
            totalSalary: number
        },
        accountInformations: []
    },
    postTitle: {
        id: number,
        postTitleDescription: string,
        postTitleType: string,
        isActive: boolean,
        createAt: string,
        updateAt: string
    },
    postPositions: PositionI[],
    trainingPositions: TrainingPositionsI[]

}
export type TrainingPositionsI = {
    id: number,
    postId: number,
    positionName: string,
    amount: number,
    salary: number
}
export type PositionI = {
    id: number,
    postId: number,
    positionName: string,
    amount: number,
    salary: number
}
export type ListPositionI = {
    key: string,
    position: PositionI[];
}
export type PostTitleI = {
    id: number,
    postTitleDescription: string,
    postTitleType: string,
    isActive: boolean,
    createAt: string,
    updateAt: string
}
export default Post