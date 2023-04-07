import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {TokenStorageService} from "../token_storage_service/token-storage.service";
import {Observable, tap} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_API = environment.apiUrl;
  private renderer: Renderer2;
  private httpOptions: any;

  public user_id: number;

  constructor(private http: HttpClient, private router: Router, rendererFactory: RendererFactory2, private tokenStorage: TokenStorageService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  login(user: any): Observable<any> {
    return this.http.post(this.AUTH_API + 'login', JSON.stringify(user), this.httpOptions);
  }

  public logout() {
    this.tokenStorage.signOut();
  }

  refreshToken() {
    return this.http.post<any>(this.AUTH_API + 'refresh_token', {
      'refresh': this.tokenStorage.getRefreshToken()
    }).pipe(tap((token) => {
      this.tokenStorage.saveToken(token['access']);
    }));
  }

  isAuthenticated() {
    return this.tokenStorage.getRefreshToken()
  }

  getRole(){
    return this.tokenStorage.getUserRole();
  }
}
