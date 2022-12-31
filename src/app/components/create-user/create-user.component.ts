import {Component, OnInit} from '@angular/core';
import {Doctor} from "../../models/doctor_model/doctor";
import {UserService} from "../../services/users_service/user.service";
import {ModalServiceService} from "../../services/modal_service/modal-service.service";

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
  isWrong: any;
  message: any;

  constructor(private userService: UserService, private modalService: ModalServiceService) {
  }

  ngOnInit(): void {
    this.retrieve();
  }

  private retrieve(): void {
    this.userService.getUserRoles().subscribe({
      next: (data) => {
        this.typeSearch = data['roles'];
      }, error: (e) => {
        console.error(e);
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
        this.message = e['error']['message'];
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
