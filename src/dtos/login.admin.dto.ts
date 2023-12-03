export default interface LoginAdminDto {
    status: {
        success: boolean,
        message: string,
        errorCode: number
    },
    data: {
        id: number,
        username: string,
        name: string,
        roleId: number,
        accessToken: string
    }
}