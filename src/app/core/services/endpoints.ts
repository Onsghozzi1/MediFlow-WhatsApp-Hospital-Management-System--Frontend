export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/token',
    SIGNUP: '/api/auth/signup',
    USERList: 'userManagement/UserPagination'
  },
  PATIENTS: {
    BASE: 'Patient',
    GETALL: '/PatientPagination',
    POST: '/add-patient',
    PUT: '/edit-patient',
    DELETE: '/delete',
    GETAPPO: '/get_patients',
    List_Patient: '/all_list_patients',
  },
  APPOINTMENTS: {
    BASE: 'Appointment',
    GETALL: '/AppointmentPagination',
    POST: '/add-appointment',
    PUT: '/edit-appointment',
    DELETE: '/delete',
    CALENDER: '/get_calendar',
    WATSAPP: '/send',
    GETPatientAPPO: '/patients_appointment'

  },
  APPOINTMENTS_patient: {
    BASE: 'patient_appointments',
    POST: '/add_appointment_patient',
  

  }
};