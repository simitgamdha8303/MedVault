import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private hubConnection?: signalR.HubConnection;

  constructor(private authService: AuthService, private snackbar: SnackbarService) {}

  startConnection(): void {
    const token = this.authService.getToken();
    if (!token) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.signalRBaseUrl}/hubs/notifications`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected'))
      .catch((err) => console.error('SignalR error:', err));

    this.hubConnection.on('ReminderNotification', (reminder) => {
      this.snackbar.showReminder(reminder.title, reminder.message);
    });
  }

  stop(): void {
    this.hubConnection?.stop();
  }
}
