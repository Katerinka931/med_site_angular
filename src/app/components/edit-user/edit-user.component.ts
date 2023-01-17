import {Component, HostListener, OnInit} from '@angular/core';
import {Doctor} from "../../models/doctor_model/doctor";
import {UserService} from "../../services/users_service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";
import {ModalServiceService} from "../../services/modal_service/modal-service.service";
import {Location} from '@angular/common';
import {Observable} from "rxjs";

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

  access_error: boolean = false;
  flag: boolean = true;

  constructor(private userService: UserService, private route: ActivatedRoute, private tokenStorage: TokenStorageService,
              private modalService: ModalServiceService, private location: Location) {
  }

  ngOnInit(): void {
    this.retrieve();
    this.userRole = this.tokenStorage.getUserRole()!;
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return this.flag;
  }

  change(event: any) {
    this.flag = false;
  }

  valueChange(event: any) {
    this.selected = event.target.value;
  }

  private retrieve(): void {
    this.access_error = false;
    this.userService.getUser(this.currentID).subscribe({
      next: (data) => {
        this.currentUser = data["user"];
        this.usersEnum = data['roles'];
        this.selected = this.getRole(this.currentUser.role!).toUpperCase();
        this.getListOfRoles(this.usersEnum);
      }, error: (e) => {
        if (e.status == 403) {
          this.message = 'Доступ запрещен!';
          this.access_error = true;
        } else {
          if (e.status == 404)
            this.message = e['error']['message']
          else {
            this.message = "Ошибка загрузки данных";
            this.access_error = true;
          }
        }
        this.openModal('message_modal');
      }
    });
  }

  private getRole(role: string): string {
    let currentRole = this.usersEnum.find((obj: string) => {
      return obj === role;
    });
    return currentRole!;
  }

  private getListOfRoles(roles: any) {
    for (let role in roles) {
      this.typeSearch[role] = roles[role].toUpperCase();
    }
  }

  editDoctor(modal: string): void {
    this.currentUser.role = this.selected;
    this.userService.editUser(this.currentID, this.currentUser)
      .subscribe({
        next: (data) => {
          this.message = data['message'];
          this.flag = true;
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
    if (this.access_error) {
      this.location.back();
    }
  }
}
