import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth_service/auth.service";
import {Doctor} from "../../models/doctor_model/doctor";
import {UserService} from "../../services/users_service/user.service";
import {ModalServiceService} from "../../services/modal_service/modal-service.service";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: Doctor = {};
  password: string;
  new_password: string;
  new_password_repeat: string;
  message: string;
  gotSuccess: boolean;

  constructor(private tokenStorage: TokenStorageService, private userService: UserService, private token: AuthService,
              private modalService: ModalServiceService) { }

  ngOnInit(): void {
    this.retrieve();
  }

  private retrieve(): void {
    this.userService.getDoctorHimself(this.token.user_id).subscribe({
      next: (data) => {
        this.currentUser = data["user"];
      }, error: (e) => {
        this.message = "Ошибка загрузки данных"
        this.openModal('message_modal');
      }
    });
  }

  editDoctor(modal: string): void {
    this.userService.editDoctorHimself(this.token.user_id!, this.currentUser)
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

  changePassword(modal: string) {
    const data = {
      password: this.password,
      new_password: this.new_password,
      new_password_repeat: this.new_password_repeat
    }
    this.userService.changePassword(data).subscribe({
      next: (data) => {
        this.message = data['message'];
        this.gotSuccess = true;
      },
      error: (e) => {
        e.status != 500 ? this.message = e['error']['message'] : this.message == "Ошибка сервера";
        this.gotSuccess = false;
      }
    });
  }

  openModal(id: string) {
    this.modalService.open(id);
    this.clearPasswordData()
  }

  closeModal(id: string) {
    this.modalService.close(id);
    this.message = '';
  }

  clearPasswordData(){
    this.password = '';
    this.new_password = '';
    this.new_password_repeat = '';
  }

}




