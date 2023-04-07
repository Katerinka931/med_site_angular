import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Doctor} from "../../models/doctor_model/doctor";
import {Patient} from "../../models/patient_model/patient";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MainPageService {
  private baseUrl = environment.apiUrl + 'main';
  constructor(private http: HttpClient) {
  }

  getAllDoctors(id: any): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}`);
  }

  getAllPatients(id: any): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}`);
  }

  delete(pk: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}?remove=${pk}`);
  }
}

