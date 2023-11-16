
type Registrations = {
    id: number,
    registrationCode: number,
    status: number,
    schoolBusOption: boolean,
    createAt: Date,
    updateAt: Date,
    account: AccountI,
    postRegistrationDetails: PostRegistrationDetailsI[]
}
export type PostRegistrationDetailsI = {
    id: number,
    postRegistrationId: number,
    postId: number,
    positionId: number,
    note: string,
    salaryBonus: number,
    salary: number,
    finalSalary: number
}

export type AccountI = {
    id: number,
    roleId: number,
    name: string,
    email: string,
    phone: number,
    imgUrl: string,
    isPremium: boolean
}

export default Registrations