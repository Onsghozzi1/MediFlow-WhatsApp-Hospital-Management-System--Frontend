
export interface appointment_filter {
  patient_name: any;
  id: any;
  appointmentDate: Date | null;
  priority : Priority| null;
  status : AppointmentStatus| null;
  appointment_Type : AppointmentType| null;


}
export interface appointment_List {
  content: any;
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  total_Appointments: any;
  completed: any;
  upcoming: any;
  today_Appointments: any
}
export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
  SCHEDULED='SCHEDULED'
}
export enum AppointmentType {
  CONSULTATION = 'CONSULTATION',
  FOLLOW_UP = 'FOLLOW_UP',
  EMERGENCY = 'EMERGENCY',
  ONLINE = 'ONLINE'
}
export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}
export interface Patient {
  patientId: number;
  fullName: string;
  medical_Record_ID: string;
  phone: string;
  email?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  availableSlots?: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  duration: number;
  available: boolean;
}