import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private selectedRoleSubject = new BehaviorSubject<string>('patient');
  selectedRole$ = this.selectedRoleSubject.asObservable();

  setSelectedRole(role: string) {
    this.selectedRoleSubject.next(role);
  }

  getSelectedRole(): string {
    return this.selectedRoleSubject.value;
  }
}
