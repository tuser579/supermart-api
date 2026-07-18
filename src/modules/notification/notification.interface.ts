export interface ICreateNotificationDTO {
  userId: string;
  title: string;
  message: string;
  type: string;
  data?: Record<string, unknown>;
}
