export type ApplicationI = {
    id: number,
    accountId: number,
    reportDate: Date,
    replyDate: Date,
    problemNote: string,
    replyNote: string,
    status: number,
    account: {
        id: number,
        roleId: number,
        accountInformationId: number,
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
        accountInformation: {
            id: number,
            accountId: number,
            identityNumber: string,
            idStudent: string,
            fbUrl: string,
            address: string,
            identityIssueDate: Date,
            placeOfIssue: string,
            identityFrontImg: string,
            identityBackImg: string,
            taxNumber: string
        }
    }
}