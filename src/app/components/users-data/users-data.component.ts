import {Component, OnInit} from '@angular/core';
import {Doctor} from "../../models/doctor_model/doctor";
import {UserService} from "../../services/users_service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Patient} from "../../models/patient_model/patient";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";
import {ModalServiceService} from "../../services/modal_service/modal-service.service";

@Component({
  selector: 'app-users-data',
  templateUrl: './users-data.component.html',
  styleUrls: ['./users-data.component.css']
})
export class UsersDataComponent implements OnInit {
  user: Doctor = {};
  patients?: Patient[];
  selectedPatient: Patient = {};
  role: string;
  currentUserRole: string;
  message: string;
  roles: string[] = [];
  tempID: any;
  peopleIsNull = false;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private tokenStorage: TokenStorageService, private modalService: ModalServiceService) {
  }

  ngOnInit(): void {
    this.retrieve();
    this.currentUserRole = this.tokenStorage.getUserRole()!;
  }

  private retrieve(): void {
    this.userService.getAnotherDoctor(this.route.snapshot.params["usr"]).subscribe({
      next: (data) => {
        this.user = data["user"];
        this.patients = this.user["patients"];
        this.roles = data['roles'];
        this.role = this.getRole(this.user.role!);
        this.peopleIsNull = this.patients?.length == 0;
      }, error: (e) => {
        this.message = "Ошибка загрузки данных"
        this.openModal('message_modal');
      }
    });
  }

  getRole(role: string): string {
    return this.roles.find((obj: string) => {
      return obj === role;
    })!;
  }

  refreshList(): void {
    this.retrieve();
    this.selectedPatient = {};
  }

  setActivePatient(pat: Patient) {
    this.selectedPatient = pat;
  }

  gotoPatient(pat: Patient) {
    console.log(this.user.role);
    if (this.tokenStorage.getUserRole() != 'ADMIN') {
      this.setActivePatient(pat);
      this.router.navigate([`/patient/${this.selectedPatient.id}`]);
    }
  }

  remove(modal: string, prev_modal: string) {
    this.message = '';
    this.closeModal(prev_modal);
    this.userService.deletePatient(this.user.id, this.tempID).subscribe({
      next: (res) => {
        this.message = res['message'];
        this.refreshList();
      },
      error: (e) => {
        e.status != 500 ? this.message = e['error']['message'] : this.message = "Ошибка сервера"
      }
    })
    this.openModal(modal);
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  open(id: any, last_name: any, first_name: any, middle_name: any, modal: any) {
    this.openModal(modal);
    this.message = last_name + ' ' + first_name + ' ' + middle_name;
    this.tempID = id;
  }
}
