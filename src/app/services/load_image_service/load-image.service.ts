import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Patient} from "../../models/patient_model/patient";

const baseUrl = 'http://localhost:8000/load_image';

@Injectable({
  providedIn: 'root'
})
export class LoadImageService {
  private httpOptions: any;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${baseUrl}`, formData, {
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getPatients(id: any): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${baseUrl}`);
  }

  save(data: any, act: string, file: File): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('pat_id', data['pat_id']);
    formData.append('diagnosys', data['diagnosys']);

    const req = new HttpRequest('POST', `${baseUrl}?act=${act}`, formData, {
      responseType: 'json'
    });
    return this.http.request(req);
    // return this.http.post(`${baseUrl}?act=${act}`, data);
  }
}
