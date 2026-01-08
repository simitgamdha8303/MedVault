import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddMedicaltimelineDialogComponent } from './add-medicaltimeline-dialog/add-medicaltimeline-dialog';

@Component({
  selector: 'app-medicaltimeline',
  imports: [MatButtonModule,],
  templateUrl: './medicaltimeline.html',
  styleUrl: './medicaltimeline.css',
})
export class Medicaltimeline {
  private dialog = inject(MatDialog);

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddMedicaltimelineDialogComponent, {
      width: '520px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Payload to backend:', result);
      }
    });
  }
}
