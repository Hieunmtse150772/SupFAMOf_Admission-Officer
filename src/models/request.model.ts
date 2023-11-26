
type RequestInfo = {
    id: number,
    postRegistrationId: number,
    busOption: boolean,
    status: number,
    createAt: string,
    postPositionNeedToBeUpdated: PosttPositionNeedToBeUpdatedI,
    originalPosition: OriginalPositionI,
    post: PostInfoI
}
type PosttPositionNeedToBeUpdatedI = {
    id: number,
    postId: number,
    trainingCertificateId: number,
    documentId: number,
    positionName: string,
    positionDescription: string,
    schoolName: string,
    location: string,
    date: string,
    latitude: number,
    longitude: number,
    timeFrom: Date,
    timeTo: Date,
    status: number,
    isBusService: boolean,
    amount: number,
    salary: number,
    positionRegisterAmount: number
}
type OriginalPositionI = {
    id: number,
    postId: number,
    trainingCertificateId: number,
    documentId: number,
    positionName: string,
    positionDescription: string,
    schoolName: string,
    location: string,
    date: Date,
    latitude: number,
    longitude: number,
    timeFrom: Date,
    timeTo: Date,
    status: number,
    isBusService: boolean,
    amount: number,
    salary: number,
    positionRegisterAmount: number
}
type PostInfoI = {
    id: number,
    accountId: number,
    postCategoryId: number,
    postCode: number,
    postImg: string,
    postDescription: string,
    priority: number,
    dateFrom: Date,
    dateTo: Date,
    isPremium: boolean,
    status: number,
    attendanceComplete: boolean,
    createAt: Date,
    updateAt: Date,
    account: {
        id: number,
        roleId: number,
        accountInformationId: boolean,
        name: string,
        email: string,
        phone: string,
        dateOfBirth: Date,
        imgUrl: string,
        postPermission: boolean,
        isPremium: boolean,
        isActive: boolean,
        isBanned: boolean,
        createAt: Date,
        updateAt: Date,
        accountInformation: boolean
    },
    postCategory: {
        id: number,
        postCategoryDescription: string,
        postCategoryType: string,
        isActive: boolean,
        createAt: Date,
        updateAt: boolean
    }
}
export default RequestInfo