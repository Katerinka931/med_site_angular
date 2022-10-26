import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Patient} from "../../models/patient_model/patient";

const createUrl = 'http://localhost:8000/create_patient';
const patientsUrl = 'http://localhost:8000/patients';
const patientUrl = 'http://localhost:8000/patient';
const editUrl = 'http://localhost:8000/edit_patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient) { }

  createPatient(data: any): Observable<any> {
    return this.http.post(createUrl, data);
  }

  getListOfDoctorsToCreatePatient(): Observable<any> {
    return this.http.get(createUrl);
  }

  getPatients(id: any): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${patientsUrl}`);
  }

  delete(pk: any): Observable<any> {
    return this.http.delete(`${patientsUrl}?remove=${pk}`);
  }

  getPatientsData(pat: any): Observable<Object> {
    return this.http.get<Object>(`${patientUrl}/${pat}`);
  }

  editPatient(pat: any, data: any): Observable<any> {
    return this.http.put(`${editUrl}/${pat}`, data);
  }

  getPatient(pat: any): Observable<Object> {
    return this.http.get<Object>(`${editUrl}/${pat}`);
  }
}
