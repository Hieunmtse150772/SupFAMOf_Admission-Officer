
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
    certificates: Certificate[]
}
type Certificate = {
    id: number,
    certificateName: string,
    trainingCertificateId: number
}


export default CollabListInfo;