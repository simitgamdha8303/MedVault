import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-base-layout',
  imports: [Header, RouterOutlet, Sidebar, CommonModule],
  templateUrl: './base-layout.html',
  styleUrl: './base-layout.css',
})
export class BaseLayout implements OnInit {
  isSidebarOpen = true;
  private authService = inject(AuthService);
  private renderer = inject(Renderer2);

  ngOnInit() {
    // Get user role and apply theme
    const userRole = this.authService.getUserRole();
    this.applyTheme(userRole);
  }

  applyTheme(role: string | null) {
    // Remove existing theme classes
    this.renderer.removeClass(document.body, 'patient-theme');
    this.renderer.removeClass(document.body, 'doctor-theme');

    // Apply new theme class based on role
    if (role === 'Doctor') {
      this.renderer.addClass(document.body, 'doctor-theme');
    } else {
      // Default to patient theme
      this.renderer.addClass(document.body, 'patient-theme');
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
