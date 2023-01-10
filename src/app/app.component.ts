import {Component} from "@angular/core";
import {TokenStorageService} from "./services/token_storage_service/token-storage.service";
import {NavigationStart, Router} from "@angular/router";
import {AuthService} from "./services/auth_service/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{
  title = 'Medicine Application';
  showNav: boolean = false;
  role: string;

  constructor(private router: Router, private authService: AuthService, private tokenStorage: TokenStorageService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.showNav = event['url'] != '/';
        this.role = tokenStorage.getUserRole()!;
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
