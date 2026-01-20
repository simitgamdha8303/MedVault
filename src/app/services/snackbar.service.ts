import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  showReminder(title: string, message: string): void {
    this.snackBar.open(
      `⏰ ${title}: ${message}`,
      'OK',
      {
        duration: 10000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      }
    );
  }
}
