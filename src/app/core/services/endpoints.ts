export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/token',
    SIGNUP: '/api/auth/signup',
    USERList: 'userManagement/UserPagination'
  },
  PATIENTS: {
    BASE: 'Patient',
    GETALL:'/PatientPagination',
    POST:'/add-patient',
    PUT: '/edit-patient',
    DELETE:'/delete'
  },
  APPOINTMENTS: {
    BASE: 'Appointment',
    GETALL:'/AppointmentPagination',
    POST:'/add-appointment'
  }
};