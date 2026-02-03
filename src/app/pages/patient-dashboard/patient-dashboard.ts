import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReminderService } from '../../services/reminder.service';
import { DashboardService } from '../../services/dashboard.service';
import { Chart, TooltipItem } from 'chart.js/auto';
import { NotificationService } from '../../services/notification.service';
type VisitChartFilter = 'current-month' | 'last-3-months' | 'current-year' | 'last-year';

interface Reminder {
  id: number;
  title: string;
  description: string;
  reminderTime: string;
}

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css',
})
export class PatientDashboard implements OnInit {
  readonly now = signal(new Date());

  readonly reminders = signal<Reminder[]>([]);
  readonly selectedDate = signal<Date | null>(null);
  readonly selectedReminders = signal<Reminder[]>([]);

  readonly totalRecords = signal<number>(0);
  readonly lastVisit = signal<any | null>(null);
  readonly upcomingAppointment = signal<string | null>(null);

  readonly chartFilter = signal<VisitChartFilter>('current-month');
  readonly visitChartData = signal<any[]>([]);

  private reminderService = inject(ReminderService);
  private dashboardService = inject(DashboardService);
  private notificationService = inject(NotificationService);

  private chart?: Chart;

  ngOnInit() {
    const today = new Date();
    this.selectedDate.set(today);
    this.onDateSelected(today);

    this.loadReminders();
    this.loadDashboardData();
    this.loadVisitChart();

    setInterval(() => {
      this.now.set(new Date());
    }, 1000);

    this.notificationService.appointmentUpdated$.subscribe(() => {
      this.loadDashboardData();
      this.loadVisitChart();
    });
  }

  loadDashboardData() {
    this.dashboardService.getTotalRecords().subscribe((res) => {
      if (res.succeeded) {
        this.totalRecords.set(res.data);
      }
    });

    this.dashboardService.getLastVisit().subscribe((res) => {
      if (res.succeeded) {
        this.lastVisit.set(res.data);
      }
    });

    this.dashboardService.getUpcomingAppointment().subscribe((res) => {
      if (res.succeeded) {
        this.upcomingAppointment.set(res.data);
      }
    });
  }

  loadVisitChart() {
    this.dashboardService.getVisitChart(this.chartFilter()).subscribe((res) => {
      if (res.succeeded) {
        this.visitChartData.set(res.data);
        this.renderChart();
      }
    });
  }

  renderChart() {
    if (this.chart) this.chart.destroy();

    const labels = this.visitChartData().map((x) => x.label);
    const counts = this.visitChartData().map((x) => x.count);
    const doctors = this.visitChartData().map((x) => x.doctors);

    this.chart = new Chart('visitChart', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Doctor Visits',
            data: counts,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              afterBody: (ctx: TooltipItem<'line'>[]) => {
                const index = ctx[0].dataIndex;
                return ['', 'Doctors:', ...doctors[index].map((d: string) => `• ${d}`)];
              },
            },
          },
        },
      },
    });
  }

  setFilter(filter: VisitChartFilter) {
    this.chartFilter.set(filter);
    this.loadVisitChart();
  }

  loadReminders() {
    this.reminderService.getByPatient().subscribe((res) => {
      if (res.succeeded) {
        this.reminders.set(res.data);
        this.onDateSelected(this.selectedDate());
      }
    });
  }

  dateClass = (date: Date) => {
    return this.reminders().some(
      (r) => new Date(r.reminderTime).toDateString() === date.toDateString()
    )
      ? 'reminder-day'
      : '';
  };

  onDateSelected(date: Date | null) {
    if (!date) return;

    this.selectedDate.set(date);

    const list = this.reminders().filter(
      (r) => new Date(r.reminderTime).toDateString() === date.toDateString()
    );

    this.selectedReminders.set(list);
  }
}
