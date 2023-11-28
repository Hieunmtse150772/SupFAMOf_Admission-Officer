
type PostInfo = {
    accountId: number,
    id: number;
    postCategoryId: number,
    postCode: string,
    postDescription: string,
    dateFrom: Date,
    dateTo: Date,
    timeFrom: Date,
    timeTo: Date,
    postImg: string;
    priority: number,
    isPremium: boolean,
    location: string,
    attendanceComplete: boolean,
    isActive: true,
    status: number,
    isEnd: false,
    createAt: Date,
    updateAt: Date,
    totalUpdateRegisterAmount: number,
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
    postPositions: PositionI[],
    trainingPositions: TrainingPositionsI[];
    postCategory: PostTitleI;

}
export type TrainingPositionsI = {
    id: number,
    postId: number,
    trainingCertificateId: number;
    positionName: string,
    documentId: number;
    isBusService: boolean;
    latitude: string;
    longtitude: string;
    date: Date;
    timeFrom: Date;
    timeTo: Date;
    registerAmount: number;
    amount: number,
    salary: number
}
export type PositionI = {
    id: number,
    postId: number,
    trainingCertificateId: number;
    positionName: string,
    documentId: number;
    isBusService: boolean;
    latitude: string;
    date: Date;
    longtitude: string;
    timeFrom: Date;
    timeTo: Date;
    positionRegisterAmount: number;
    amount: number,
    salary: number
}
export type ListPositionI = {
    key: string,
    position: PositionI[];
}
export type PostTitleI = {
    id: number,
    postCategoryDescription: string,
    postCategoryType: string,
    isActive: boolean,
    createAt: string,
    updateAt: string
}
export default PostInfo