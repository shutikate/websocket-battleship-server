export interface User {
  name: string;
  password: string;
}

export interface RegistrationResponse {
  type: string;
  data: {
    name: string;
    index: number | string;
    error: boolean;
    errorText: string;
  };
  id: number;
}
