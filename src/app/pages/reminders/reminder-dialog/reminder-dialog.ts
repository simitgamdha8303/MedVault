import { CommonModule } from '@angular/common';
import { Component, signal, effect, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LookupService } from '../../../services/lookup.service';
import { ReminderService } from '../../../services/reminder.service';

@Component({
  selector: 'app-reminder-dialog',
  standalone: true,
  templateUrl: './reminder-dialog.html',
  styleUrls: ['./reminder-dialog.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class ReminderDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ReminderDialogComponent>);
  private lookupService = inject(LookupService);
  private reminderService = inject(ReminderService);
  private data = inject(MAT_DIALOG_DATA);

  form: FormGroup;
  today = new Date(new Date().setHours(0, 0, 0, 0));

  isEdit = signal(false);
  reminderTypes = signal<any[]>([]);
  recurrenceTypes = signal<any[]>([]);
  recurrenceNoneId = signal<number | null>(null);
  reminder = signal<any | null>(null);

  constructor() {
    this.isEdit.set(this.data?.mode === 'edit');

    this.form = this.fb.group({
      reminderType: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      reminderDate: [null, Validators.required],
      reminderTime: ['', Validators.required],
      recurrenceType: [null, Validators.required],
      recurrenceEndDate: [{ value: null, disabled: true }],
    });

    effect(() => {
      if (!this.isEdit()) return;

      const reminder = this.reminder();
      const reminderTypes = this.reminderTypes();
      const recurrenceTypes = this.recurrenceTypes();

      if (!reminder) return;
      if (!reminderTypes.length || !recurrenceTypes.length) return;

      const utcDate = new Date(reminder.reminderTime);

      const type = reminderTypes.find((t) => t.name === reminder.reminderType);
      const recurrence = recurrenceTypes.find((r) => r.name === reminder.recurrenceType);

      this.form.patchValue({
        reminderType: type?.id ?? null,
        title: reminder.title,
        description: reminder.description,
        reminderDate: utcDate,
        reminderTime: utcDate.toTimeString().substring(0, 5),
        recurrenceType: recurrence?.id ?? null,
        recurrenceEndDate: reminder.recurrenceEndDate ? new Date(reminder.recurrenceEndDate) : null,
      });

      if (recurrence?.id !== this.recurrenceNoneId()) {
        this.form.get('recurrenceEndDate')?.enable({ emitEvent: false });
      }
    });

    this.form.get('recurrenceType')!.valueChanges.subscribe((value) => {
      const noneId = this.recurrenceNoneId();
      if (noneId === null) return;
      const endCtrl = this.form.get('recurrenceEndDate');

      if (value && value !== this.recurrenceNoneId()) {
        endCtrl?.enable();
      } else {
        endCtrl?.disable();
        endCtrl?.setValue(null);
      }
    });

    this.loadLookups();

    if (this.isEdit()) {
      this.loadReminder(this.data.id);
    }
  }

  loadLookups() {
    this.lookupService
      .getReminderTypes()
      .subscribe((res) => this.reminderTypes.set(res.data ?? []));

    this.lookupService.getRecurrenceType().subscribe((res) => {
      const list = res.data ?? [];
      this.recurrenceTypes.set(list);

      const none = list.find((x: any) => x.name === 'None');
      this.recurrenceNoneId.set(none?.id ?? null);
    });
  }

  loadReminder(id: number) {
    this.reminderService.getById(id).subscribe((res) => this.reminder.set(res.data));
  }

  submit() {
    if (this.form.invalid) return;

    const v = this.form.value;
    const [h, m] = v.reminderTime.split(':');

    const dt = new Date(v.reminderDate);
    dt.setHours(+h, +m, 0, 0);

    const payload = {
      reminderTypeId: v.reminderType,
      title: v.title,
      description: v.description,
      reminderTime: dt.toISOString(), // UTC
      recurrenceType: v.recurrenceType,
      recurrenceInterval: v.recurrenceType === this.recurrenceNoneId() ? 0 : 1,
      recurrenceEndDate: v.recurrenceEndDate ? new Date(v.recurrenceEndDate).toISOString() : null,
    };

    const req$ = this.isEdit()
      ? this.reminderService.update(this.reminder()?.id, payload)
      : this.reminderService.create(payload);

    req$.subscribe(() => this.dialogRef.close(true));
  }

  close() {
    this.dialogRef.close();
  }
}
