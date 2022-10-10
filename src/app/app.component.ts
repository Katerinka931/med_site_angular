import {Component, OnInit} from '@angular/core';
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

  constructor(private router: Router, private authService: AuthService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.showNav = event['url'] != '/';
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
