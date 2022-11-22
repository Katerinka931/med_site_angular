import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const createUrl = 'http://localhost:8000/create_user';
const profileUrl = 'http://localhost:8000/profile';
const userUrl = 'http://localhost:8000/user';
const editUrl = 'http://localhost:8000/edit_user';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) {
  }

  createUser(data: any): Observable<any> {
    return this.http.post(createUrl, data);
  }

  getDoctorHimself(id: any): Observable<Object> {
    return this.http.get<Object>(`${profileUrl}`);
  }

  editDoctorHimself(id: number, data: any): Observable<any> {
    return this.http.put(`${profileUrl}`, data);
  }

  getAnotherDoctor(id: any): Observable<Object> {
    return this.http.get<Object>(`${userUrl}/${id}`);
  }

  deletePatient(usr: any, id: any): Observable<any> {
    return this.http.delete(`${userUrl}/${usr}?remove=${id}`);
  }

  getUser(usr: any): Observable<Object> {
    return this.http.get<Object>(`${editUrl}/${usr}`);
  }

  editUser(id: number, data: any): Observable<any> {
    return this.http.put(`${editUrl}/${id}`, data);
  }

  changePassword(data: any) {
    return this.http.post(profileUrl, data)
  }
}
