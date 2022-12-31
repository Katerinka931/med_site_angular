import {Component, OnInit} from '@angular/core';
import {Doctor} from "../../models/doctor_model/doctor";
import {UserService} from "../../services/users_service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
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

  typeSearch: string[];
  selected = '';
  message: any;
  userRole: string;


  constructor(private userService: UserService, private route: ActivatedRoute, private tokenStorage: TokenStorageService, private modalService: ModalServiceService) {
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
        this.typeSearch = data['roles'];
        this.getSelected();
      }, error: (e) => console.error(e)
    });
  }

  editDoctor(modal: string): void {
    this.currentUser.role = this.selected;
    this.userService.editUser(this.currentID, this.currentUser)
      .subscribe({
        next: (data) => {
          this.message = data['message'];
        },
        error: (e) => {
          console.error(e);
          this.message = e['error']['message'];
        }
      });
    this.openModal(modal);
  }

  private getSelected() {
    switch (this.currentUser.role) {
      case 'DOCTOR':
        this.selected = 'ВРАЧ';
        break;
      case 'CHIEF':
        this.selected = 'ГЛАВНЫЙ ВРАЧ';
        break;
      case 'OPERATOR':
        this.selected = 'ОПЕРАТОР';
        break;
    }
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
