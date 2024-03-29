import {Component, OnInit} from '@angular/core';
import {Doctor} from "../../models/doctor_model/doctor";
import {UserService} from "../../services/users_service/user.service";
import {ModalServiceService} from "../../services/modal_service/modal-service.service";
import {Location} from '@angular/common';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})

export class CreateUserComponent implements OnInit {
  user: Doctor = {};
  password: any;
  password_repeat: any;
  submitted = false;

  typeSearch: string[];
  selected = '';
  message: any;

  access_error: boolean = false;

  constructor(private userService: UserService, private modalService: ModalServiceService, private location: Location) {
  }

  ngOnInit(): void {
    this.retrieve();
  }

  private retrieve(): void {
    this.userService.getUserRoles().subscribe({
      next: (data) => {
        this.access_error = false;
        this.typeSearch = data['roles'];
      }, error: (e) => {
        if (e.status == 403) {
          this.message = 'Доступ запрещен!';
          this.access_error = true;
        } else {
          this.message = "Ошибка загрузки данных"
          this.access_error = false;
        }
        this.openModal('message_modal');
      }
    });
  }

  valueChange(event: any) {
    this.selected = event.target.value;
  }

  saveUser(modal: string) {
    this.message = ''
    const data = {
      role: this.selected,
      last_name: this.user.last_name,
      first_name: this.user.first_name,
      middle_name: this.user.middle_name,
      email: this.user.email,
      phone: this.user.phone,
      login: this.user.login,
      password: this.password,
      password_repeat: this.password_repeat,
    }
    this.userService.createUser(data).subscribe({
      next: (res) => {
        this.submitted = true;
        this.message = res['message'];
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
