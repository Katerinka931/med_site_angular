import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Patient} from "../../models/patient_model/patient";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private createUrl = environment.apiUrl + 'create_patient';
  private patientsUrl = environment.apiUrl + 'patients';
  private patientUrl = environment.apiUrl + 'patient';
  private editUrl = environment.apiUrl + 'edit_patient';
  constructor(private http: HttpClient) {
  }

  createPatient(data: any): Observable<any> {
    return this.http.post(this.createUrl, data);
  }

  getListOfDoctorsToCreatePatient(): Observable<any> {
    return this.http.get(this.createUrl);
  }

  getPatients(id: any): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.patientsUrl}`);
  }

  delete(pk: any): Observable<any> {
    return this.http.delete(`${this.patientsUrl}?remove=${pk}`);
  }

  getPatientsData(pat: any): Observable<Object> {
    return this.http.get<Object>(`${this.patientUrl}/${pat}`);
  }

  getAllPhotos(pat: any): Observable<Object> {
    return this.http.get<Object>(`${this.patientUrl}/${pat}/history`);
  }

  removePhoto(pat: any, ph: any): Observable<any> {
    return this.http.delete(`${this.patientUrl}/${pat}?id=${ph}`);
  }

  editPatient(pat: any, data: any): Observable<any> {
    return this.http.put(`${this.editUrl}/${pat}`, data);
  }

  getPatient(pat: any): Observable<Object> {
    return this.http.get<Object>(`${this.editUrl}/${pat}`);
  }

  download(pat: any, ph: any, type: string): Observable<Object> {
    return this.http.get<Object>(`${this.patientUrl}/${pat}/download/${type}?id=${ph}`);
  }

  loadImage(file: File, pat: any, diag: string, date: any, photo_id: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('diagnosis', diag)
    formData.append('date', date);
    formData.append('pk', photo_id);

    const req = new HttpRequest('POST', `${this.editUrl}/${pat}/photo`, formData, {
      responseType: 'json'
    });

    return this.http.request(req);
  }

  download_docx(id: any, ph: any): Observable<Object> {
    return this.http.get<Object>(`${this.patientUrl}/${id}/report?id=${ph}`);
  }
}
