export interface iSignUpRequest {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export interface iSignUpResponse {
  id?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  message?: string;
}
