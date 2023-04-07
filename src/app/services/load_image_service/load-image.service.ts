import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Patient} from "../../models/patient_model/patient";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoadImageService {
  private httpOptions: any;
  private baseUrl = environment.apiUrl + 'load_image';

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  upload(file: File, date: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('date', date);

    const req = new HttpRequest('POST', `${this.baseUrl}`, formData, {
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getPatients(id: any): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}`);
  }

  save(data: any, file: File): Observable<any> {

    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('pat_id', data['pat_id']);
    formData.append('diagnosis', data['diagnosis']);
    formData.append('custom_diagnosis', data['custom_diagnosis']);
    formData.append('date', data['date']);

    const req = new HttpRequest('POST', `${this.baseUrl}/save`, formData, {
      responseType: 'json'
    });
    return this.http.request(req);
  }

  download(id: any): Observable<Object> {
    return this.http.get<Object>(`${this.baseUrl}/download_report?id=${id}`);
  }
}

