import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private hubConnection?: signalR.HubConnection;
  private authService = inject(AuthService);
  private snackbar = inject(SnackbarService);
  private appointmentUpdatedSource = new Subject<void>();
  appointmentUpdated$ = this.appointmentUpdatedSource.asObservable();
  private qrShareUpdatedSource = new Subject<void>();
  qrShareUpdated$ = this.qrShareUpdatedSource.asObservable();

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

    this.hubConnection.on('QrShareUpdated', () => {
      this.qrShareUpdatedSource.next();
    });

    this.hubConnection.on('AppointmentUpdated', () => {
      this.appointmentUpdatedSource.next();
    });
  }

  stop(): void {
    this.hubConnection?.stop();
  }
}
