type User = {
  id: string;
  email: string;
  fullname: string;
  gender: string;
  role: string;
  is_first_login: boolean;
  refresh_expired_at: string;
  access_expired_at: string;
  isActive: boolean;
  phone_number:string;
  type_of_premium: string;
  refresh_token: string;
  access_token: string;
  status: string;
};

export default User;
