import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private createUrl = environment.apiUrl + 'create_user';
  private profileUrl = environment.apiUrl + 'profile';
  private userUrl = environment.apiUrl + 'user';
  private editUrl = environment.apiUrl + 'edit_user';
  constructor(private http: HttpClient) {
  }

  createUser(data: any): Observable<any> {
    return this.http.post(this.createUrl, data);
  }

  getUserRoles(): Observable<any> {
    return this.http.get(this.createUrl);
  }

  getDoctorHimself(id: any): Observable<Object> {
    return this.http.get<Object>(`${this.profileUrl}`);
  }

  editDoctorHimself(id: number, data: any): Observable<any> {
    return this.http.put(`${this.profileUrl}`, data);
  }

  getAnotherDoctor(id: any): Observable<Object> {
    return this.http.get<Object>(`${this.userUrl}/${id}`);
  }

  deletePatient(usr: any, id: any): Observable<any> {
    return this.http.delete(`${this.userUrl}/${usr}?remove=${id}`);
  }

  getUser(usr: any): Observable<Object> {
    return this.http.get<Object>(`${this.editUrl}/${usr}`);
  }

  editUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.editUrl}/${id}`, data);
  }

  changePassword(data: any) {
    return this.http.post(this.profileUrl, data)
  }
}
