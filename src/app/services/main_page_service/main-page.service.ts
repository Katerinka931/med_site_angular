import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Doctor} from "../../models/doctor_model/doctor";
import {Patient} from "../../models/patient_model/patient";

const baseUrl = 'http://localhost:8000/main';

@Injectable({
  providedIn: 'root'
})
export class MainPageService {

  constructor(private http: HttpClient) {
  }

  getAllDoctors(id: any): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${baseUrl}`);
  }

  getAllPatients(id: any): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${baseUrl}`);
  }

  delete(pk: any): Observable<any> {
    return this.http.delete(`${baseUrl}?remove=${pk}`);
  }
}

