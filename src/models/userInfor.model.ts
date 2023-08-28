type UserInfo = {
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
  accountInformations: AccountInfo[]
}
type AccountInfo = {
  id: 0,
  accountId: 0,
  personalId: string,
  idStudent: string,
  fbUrl: string,
  address: string,
  personalIdDate: string,
  placeOfIssue: string,
  personalIdFrontImg: string,
  personalIdBackImg: string,
  taxNumber: string
}

export default UserInfo;
