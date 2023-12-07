
type CollabListInfo = {
    id: number,
    name: string,
    email: string,
    phone: string,
    imgUrl: string,
    isPremium: boolean,
    idStudent: string,
    identityNumber: string,
    taxNumber: string,
    bankName: string,
    branch: string,
    certificates: Certificate[],
    isActive: boolean,
    isBanned: boolean,
    startTime: Date,
    endTime: Date
}
export type Certificate = {
    id: number,
    trainingTypeId: number,
    trainingCertificateId: number,
    status: number,
    createAt: Date,
    updateAt: Date,
    certificateName: string
}


export default CollabListInfo;