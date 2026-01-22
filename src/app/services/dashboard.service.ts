import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
type VisitChartFilter = 'current-month' | 'last-3-months' | 'current-year' | 'last-year';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/dashboard`;

  getTotalRecords() {
    return this.http.get<any>(`${this.baseUrl}/total-records`);
  }

  getLastVisit() {
    return this.http.get<any>(`${this.baseUrl}/last-visit`);
  }

  getUpcomingAppointment() {
    return this.http.get<any>(`${this.baseUrl}/upcoming-appointment`);
  }

  getVisitChart(filter: VisitChartFilter) {
    return this.http.get<any>(`${this.baseUrl}/visit-chart?filter=${filter}`);
  }

  getLastCheckup() {
    return this.http.get<any>(`${this.baseUrl}/last-checkup`);
  }

  getTotalCheckups() {
    return this.http.get<any>(`${this.baseUrl}/total-checkups`);
  }

  getTopPatients() {
    return this.http.get<any>(`${this.baseUrl}/top-patients`);
  }

  getDoctorVisitChart(filter: VisitChartFilter) {
    return this.http.get<any>(`${this.baseUrl}/doctor-visit-chart?filter=${filter}`);
  }
}
