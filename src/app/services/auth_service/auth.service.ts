import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {TokenStorageService} from "../token_storage_service/token-storage.service";
import {tap} from "rxjs";

const AUTH_API = 'http://localhost:8000/';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private renderer: Renderer2;
  private httpOptions: any;

  public user_id: null | undefined;
  public errors: any = [];

  constructor(private http: HttpClient, private router: Router, rendererFactory: RendererFactory2, private tokenStorage: TokenStorageService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  public login(user: any) {
    this.http.post(AUTH_API + 'login', JSON.stringify(user), this.httpOptions).subscribe(
      data => {
        this.saveLoginData(data);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }

  refreshToken() {
    return this.http.post<any>(AUTH_API + 'refresh_token', {
      'refresh': this.tokenStorage.getRefreshToken()
    }).pipe(tap((token) => {
      this.tokenStorage.saveToken(token['access']);
    }));
  }

  public logout() { //todo logout
    this.tokenStorage.signOut();
    this.router.navigate(['/']);
  }

  public saveLoginData(data: any) {
    this.tokenStorage.saveToken(data['access']);
    this.tokenStorage.saveRefreshToken(data["refresh"]);
    this.tokenStorage.saveUserRole(data["role"]);
    this.tokenStorage.saveUser(data);

    this.mainPage();
    // const token_parts = data['access'].split(/\./);
    // const token_decoded = JSON.parse(window.atob(token_parts[1]));
    // const token_expires = new Date(token_decoded.exp * 1000);
    // console.log(token_expires);
  }

  mainPage(): void {
    this.router.navigate(['main']);
    this.renderer.setStyle(document.body, 'background-image', 'none');
    this.renderer.setStyle(document.body, 'background-color', 'white');
  }
}
