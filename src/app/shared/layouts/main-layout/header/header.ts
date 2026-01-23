import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../../../services/role.service';
import { AuthService } from '../../../../services/auth.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private readonly router = inject(Router);
  private roleService = inject(RoleService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  userName = signal<string | null>('');

  ngOnInit(): void {
    this.userName.set(this.authService.getUserName());
  }

  logout() {
    localStorage.removeItem('token');
    this.roleService.setSelectedRole('patient');
    this.notificationService.stop();

    this.router.navigate(['/auth/login']);
  }

  @Output() toggleSidebar = new EventEmitter<void>();

  onToggle() {
    this.toggleSidebar.emit();
  }
}
