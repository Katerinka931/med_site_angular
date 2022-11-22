import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth_service/auth.service";
import {Doctor} from "../../models/doctor_model/doctor";
import {UserService} from "../../services/users_service/user.service";

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

  constructor(private userService: UserService, private token: AuthService) {
  }

  ngOnInit(): void {
    this.retrieve();
  }

  private retrieve(): void {
    this.userService.getDoctorHimself(this.token.user_id).subscribe({
      next: (data) => {
        this.currentUser = data["user"];
      }, error: (e) => console.error(e)
    });
  }

  editDoctor(): void {
    this.userService.editDoctorHimself(this.token.user_id!, this.currentUser)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (e) => {
          console.error(e);
        }
      });
  }

  changePassword() {
    const data = {
      password: this.password,
      new_password: this.new_password,
      new_password_repeat: this.new_password_repeat
    }
    this.userService.changePassword(data).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }
}
