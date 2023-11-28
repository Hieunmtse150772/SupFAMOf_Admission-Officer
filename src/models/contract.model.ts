
type ContractInfo = {
    id: string,
    contractName: string,
    createPersonId: number,
    contractDescription: string,
    sampleFile: string,
    signingDate: Date,
    startDate: Date,
    totalSalary: number,
    isActive: boolean,
    createAt: Date,
    updateAt: Date,
    accountContracts: AccountContract[]
}

export type ContractInfoRows = {
    key: string,
    id: string,
    contractName: string,
    contractDescription: string,
    sampleFile: string,
    totalSalary: number,
    isActive: boolean,
    createAt: Date,
    accountContracts: AccountContract[]
}
export type AccountContract = {
    id: number,
    contractId: number,
    accountId: number,
    submittedFile: string,
    status: number,
    createAt: Date,
    updateAt: Date,
    account: Account,
    contract: {
        id: number,
        createPersonId: number,
        contractName: string,
        contractDescription: string,
        signingDate: Date,
        startDate: Date,
        totalSalary: number,
        isActive: boolean,
        createAt: Date,
        updateAt: Date,
        createPerson: {
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
}
export type ListContractI = {
    key: string,
    contract: AccountContract[];
}
type Account = {
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
export default ContractInfo;