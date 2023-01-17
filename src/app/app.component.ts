import {Component} from "@angular/core";
import {TokenStorageService} from "./services/token_storage_service/token-storage.service";
import {NavigationStart, Router} from "@angular/router";
import {AuthService} from "./services/auth_service/auth.service";
import {ModalServiceService} from "./services/modal_service/modal-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Medicine Application';
  showNav: boolean = false;
  role: string;

  constructor(private router: Router, private authService: AuthService, private tokenStorage: TokenStorageService,
              private modalService: ModalServiceService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.showNav = event['url'] != '/';
        this.role = tokenStorage.getUserRole()!;
      }
    });
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  logout(id: string) {
    this.closeModal(id);
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
