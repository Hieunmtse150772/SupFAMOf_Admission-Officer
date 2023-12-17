
type WorkLists = {
    id: number,
    registrationCode: string,
    status: number,
    schoolBusOption: boolean,
    confirmTime: Date,
    cancelTime: Date,
    createAt: Date,
    updateAt: Date,
    positionId: number,
    note: string,
    salary: number,
    post: string,
    position: {
        totalPositionRegisterAmount: number,
        id: number,
        postId: number,
        trainingCertificateId: number,
        certificateName: string,
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
    },
    account: {
        id: number,
        roleId: number,
        name: string,
        email: string,
        phone: string,
        imgUrl: string,
        isPremium: boolean
    }
}

export default WorkLists