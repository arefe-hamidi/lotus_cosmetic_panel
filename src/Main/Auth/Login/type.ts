export interface iLoginRequest {
  username_or_email: string; // This can be email or username
  password: string;
}

export interface iLoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}
