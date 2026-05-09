
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
    
    
}
export interface patient_filter {
    id: any;
    medicalRecordIds: any;
    full_name: any;
    phone: any;
    address: any;
    gender: Gender| null;

}
export interface patient_List {
    content: any;
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    totalMale: number,
    totalFemale: number
}
