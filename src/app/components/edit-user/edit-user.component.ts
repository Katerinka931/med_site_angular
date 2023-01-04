import {Component, OnInit} from '@angular/core';
import {Doctor} from "../../models/doctor_model/doctor";
import {UserService} from "../../services/users_service/user.service";
import {ActivatedRoute} from "@angular/router";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";
import {ModalServiceService} from "../../services/modal_service/modal-service.service";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  currentUser: Doctor = {};
  currentID = this.route.snapshot.params["usr"];

  typeSearch: string[] = [];
  usersEnum: [];
  selected: any;
  message: any;
  userRole: string;


  constructor(private userService: UserService, private route: ActivatedRoute, private tokenStorage: TokenStorageService,
              private modalService: ModalServiceService) {
  }

  ngOnInit(): void {
    this.retrieve();
    this.userRole = this.tokenStorage.getUserRole()!;
  }

  valueChange(event: any) {
    this.selected = event.target.value;
  }

  private retrieve(): void {
    this.userService.getUser(this.currentID).subscribe({
      next: (data) => {
        this.currentUser = data["user"];
        this.usersEnum = data['roles'];
        this.selected = this.getRole(this.currentUser.role!).toUpperCase();
        this.getListOfRoles(this.usersEnum);
      }, error: (e) => {
        this.message = "Ошибка загрузки данных"
        this.openModal('message_modal');
      }
    });
  }

  private getRole(role: string): string {
    let currentRole = this.usersEnum.find((obj: string) => {
      return obj['role'] === role;
    });
    return currentRole!['value'];
  }

  private getListOfRoles(roles: any) {
    for (let role in roles) {
      this.typeSearch[role] = roles[role]['value'].toUpperCase();
    }
  }

  editDoctor(modal: string): void {
    this.currentUser.role = this.selected;
    this.userService.editUser(this.currentID, this.currentUser)
      .subscribe({
        next: (data) => {
          this.message = data['message'];
        },
        error: (e) => {
          e.status != 500 ? this.message = e['error']['message'] : this.message == "Ошибка сервера";
        }
      });
    this.openModal(modal);
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
