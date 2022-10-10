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
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private router: Router, private renderer: Renderer2, private tokenStorage: TokenStorageService) {
    this.renderer.setStyle(document.body, 'background-image', 'linear-gradient(45deg, #409dc9, #4fd6df)');
    this.renderer.setStyle(document.body, 'height', '150vw');
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  login() {
    this.authService.login({'username': this.username, 'password': this.password});
    this.isLoginFailed = false;
    this.isLoggedIn = true;
  }

  mainPage(): void {
    this.router.navigate(['main']);
    this.renderer.setStyle(document.body, 'background-image', 'none');
    this.renderer.setStyle(document.body, 'background-color', 'white');
  }
}
