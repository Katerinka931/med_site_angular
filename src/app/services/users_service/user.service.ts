import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const createUrl = 'http://localhost:8000/create_user';
const profileUrl = 'http://localhost:8000/profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  createUser(data: any): Observable<any> {
    return this.http.post(createUrl, data);
  }

  getDoctor(id: any): Observable<Object> {
    return this.http.get<Object>(`${profileUrl}`);
  }

  editDoctor(id: number, data: any): Observable<any> {
    return this.http.put(`${profileUrl}`, data);
  }
}
