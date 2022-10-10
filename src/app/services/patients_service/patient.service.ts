import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Patient} from "../../models/patient_model/patient";

const createUrl = 'http://localhost:8000/create_patient';
const patientsUrl = 'http://localhost:8000/patients';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient) { }

  createPatient(data: any): Observable<any> {
    return this.http.post(createUrl, data);
  }

  getPatients(id: any): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${patientsUrl}`);
  }

  delete(pk: any): Observable<any> {
    return this.http.delete(`${patientsUrl}?remove=${pk}`);
  }
}
