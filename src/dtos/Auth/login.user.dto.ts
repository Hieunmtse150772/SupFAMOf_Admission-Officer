import UserInfoLogin from "models/userInforLogin.model";

export default interface LoginUserDto {
    data: UserInfoLogin;
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }
}
