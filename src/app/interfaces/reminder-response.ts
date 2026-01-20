export interface ReminderResponse {
  id: number;
  reminderType: string;
  title: string;
  description: string;
  reminderTime: string;
  recurrenceType: string;
  recurrenceEndDate?: string | null;
}
