export interface LoginResponse {
  token?: string;
  userId?: number;
  requiresOtp: boolean;
  requiresProfile?: boolean;
}
