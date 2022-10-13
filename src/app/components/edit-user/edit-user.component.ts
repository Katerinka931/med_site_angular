import { Component, OnInit } from '@angular/core';
import {Doctor} from "../../models/doctor_model/doctor";
import {UserService} from "../../services/users_service/user.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  currentUser: Doctor = {};
  currentID = this.route.snapshot.params["usr"];

  constructor(private userService: UserService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.retrieve();
  }

  private retrieve(): void {
    this.userService.getUser(this.currentID).subscribe({
      next: (data) => {
        this.currentUser = data["user"];
      }, error: (e) => console.error(e)
    });
  }

  editDoctor(): void {
    this.userService.editUser(this.currentID, this.currentUser)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (e) => {
          console.error(e);
        }
      });
  }

}
