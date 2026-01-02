export interface ApiResponse<T> {
  succeeded: boolean;
  statusCode: number;
  message: string;
  data: T;
}
