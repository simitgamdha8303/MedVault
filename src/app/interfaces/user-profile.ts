export interface UserProfileResponse {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  twoFactorEnabled: boolean;
  role: string;
  doctorProfile?: DoctorProfile | null;
  patientProfile?: PatientProfile | null;
}

export interface DoctorProfile {
  specialization: string;
  licenseNumber: string;
  hospitalName: string;
  hospitalId?: number;

}

export interface PatientProfile {
  dateOfBirth: string;
  genderValue: string;
  gender?: number;
  bloodGroupValue: string;
  bloodGroup?: number;
  allergies?: string;
  chronicCondition?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}
