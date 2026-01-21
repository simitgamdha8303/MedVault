import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private snackBar = inject(MatSnackBar);
  private reminderRefreshSubject = new Subject<void>();
  reminderRefresh$ = this.reminderRefreshSubject.asObservable();

  showReminder(title: string, message: string): void {
    const snackRef = this.snackBar.open(`⏰ ${title}: ${message}`, 'OK', {
      duration: 10000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });

    snackRef.afterDismissed().subscribe(() => {
      this.reminderRefreshSubject.next();
    });
  }
}
