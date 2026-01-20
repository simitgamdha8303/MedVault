import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('MedVault');
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.notificationService.startConnection();
    }
  }
}
