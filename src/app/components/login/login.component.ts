import {Component, OnInit, Renderer2} from '@angular/core';
import {AuthService} from "../../services/auth_service/auth.service";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  message = '';

  isLoginFailed = false;
  public loading = false;

  constructor(private authService: AuthService, private router: Router, private renderer: Renderer2, private tokenStorage: TokenStorageService) {
    this.renderer.setStyle(document.body, 'background-image', 'linear-gradient(45deg, #409dc9, #4fd6df)');
    this.renderer.setStyle(document.body, 'height', '150vw');
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoginFailed = false;
      this.tokenStorage.signOut();
    }
  }

  login(): void {
    this.loading = true;
    this.authService.login({'username': this.username, 'password': this.password}).subscribe({
      next: data => {
        this.loading = false;
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.saveLoginData(data);
      },
      error: err => {
        this.loading = false;
        this.message = 'Неверный логин и/или пароль!';
        this.isLoginFailed = true;
      }
    });
  }

  public saveLoginData(data: any) {
    this.tokenStorage.saveToken(data['access']);
    this.tokenStorage.saveRefreshToken(data["refresh"]);
    this.tokenStorage.saveUserRole(data["role"]);
    this.tokenStorage.saveUser(data);
    this.mainPage();
  }

  mainPage(): void {
    this.router.navigate(['main']);
    this.renderer.setStyle(document.body, 'background-image', 'none');
    this.renderer.setStyle(document.body, 'background-color', 'white');
  }
}

