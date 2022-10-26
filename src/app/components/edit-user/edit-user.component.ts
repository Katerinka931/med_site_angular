import {Component, OnInit} from '@angular/core';
import {Doctor} from "../../models/doctor_model/doctor";
import {UserService} from "../../services/users_service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  currentUser: Doctor = {};
  currentID = this.route.snapshot.params["usr"];

  typeSearch: string[] = ['Главный врач', 'Врач', 'Оператор'];
  selected = '';
  gotMessage: any;
  message: any;
  userRole: string;


  constructor(private userService: UserService, private route: ActivatedRoute, private tokenStorage: TokenStorageService) {
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
        this.getSelected();
      }, error: (e) => console.error(e)
    });
  }

  editDoctor(): void {
    this.currentUser.role = this.selected;
    this.userService.editUser(this.currentID, this.currentUser)
      .subscribe({
        next: (data) => {
          this.gotMessage = true;
          this.message = data['message'];
        },
        error: (e) => {
          this.gotMessage = true;
          console.error(e);
          confirm(e['error']['message']);
        }
      });
  }

  private getSelected() {
    switch (this.currentUser.role) {
      case 'DOCTOR':
        this.selected = 'Врач';
        break;
      case 'CHIEF':
        this.selected = 'Главный врач';
        break;
      case 'OPERATOR':
        this.selected = 'Оператор';
        break;
    }
  }
}
