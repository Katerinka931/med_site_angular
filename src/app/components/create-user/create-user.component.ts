import {Component, OnInit} from '@angular/core';
import {Doctor} from "../../models/doctor_model/doctor";
import {UserService} from "../../services/users_service/user.service";

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

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
  }

  saveUser() {
    const data = {
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
        console.log(res);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }
}
