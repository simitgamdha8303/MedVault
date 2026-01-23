import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Chart, TooltipItem } from 'chart.js/auto';
import { DashboardService } from '../../services/dashboard.service';
import { Subscription } from 'rxjs';
// import { Medicaltimeline } from '../medicaltimeline/medicaltimeline';

type VisitChartFilter = 'current-month' | 'last-3-months' | 'current-year' | 'last-year';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  readonly lastCheckup = signal<any | null>(null);
  readonly totalCheckups = signal<number>(0);
  readonly topPatients = signal<any[]>([]);

  readonly chartFilter = signal<VisitChartFilter>('current-month');
  readonly visitChartData = signal<any[]>([]);

  private dashboardService = inject(DashboardService);
  private chart?: Chart;

  ngOnInit() {
    this.loadSummary();
    this.loadVisitChart();
  }

  loadSummary() {
    this.dashboardService.getLastCheckup().subscribe((res) => {
      if (res.succeeded) this.lastCheckup.set(res.data);
    });

    this.dashboardService.getTotalCheckups().subscribe((res) => {
      if (res.succeeded) this.totalCheckups.set(res.data);
    });

    this.dashboardService.getTopPatients().subscribe((res) => {
      if (res.succeeded) this.topPatients.set(res.data);
    });
  }

  loadVisitChart() {
    this.dashboardService.getDoctorVisitChart(this.chartFilter()).subscribe((res) => {
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
    const patients = this.visitChartData().map((x) =>
      Array.isArray(x.patients) ? x.patients : []
    );

    this.chart = new Chart('doctorVisitChart', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Patient Visits',
            data: counts,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              afterBody: (ctx: TooltipItem<'line'>[]) => {
                const index = ctx[0].dataIndex;
                const list = patients[index];

                if (!list || list.length === 0) {
                  return ['No patients'];
                }

                return ['', 'Patients:', ...list.map((p: string) => `• ${p}`)];
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
}
