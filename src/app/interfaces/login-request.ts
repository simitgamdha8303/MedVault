export interface LoginRequest {
  email: string;
  password: string;
  role: number; // 1 = Doctor, 2 = Patient
}
