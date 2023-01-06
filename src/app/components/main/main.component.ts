import {Component, OnInit, Renderer2} from '@angular/core';
import {Doctor} from "../../models/doctor_model/doctor";
import {MainPageService} from "../../services/main_page_service/main-page.service";
import {Patient} from "../../models/patient_model/patient";
import {AuthService} from "../../services/auth_service/auth.service";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";
import {ModalServiceService} from "../../services/modal_service/modal-service.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  doctors?: Doctor[];
  doctor: Doctor = {};
  patients?: Patient[];
  patient: Patient = {};

  peopleIsNull = false;

  selectedDoctor: Doctor = {};
  selectedPatient: Patient = {};

  userRole: string;
  header: string;

  message: any;
  tempID: any;
  roles: string[] = [];


  constructor(private mainService: MainPageService, private renderer: Renderer2, private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router, private modalService: ModalServiceService) {
    this.renderer.setStyle(document.body, 'background-color', 'white');
  }

  ngOnInit(): void {
    this.doctor = this.tokenStorage.getUser();
    this.userRole = this.tokenStorage.getUserRole()!;
    this.renderer.setStyle(document.body, 'background-color', 'white');
    this.retrieve();
    this.createHeader();
  }

  refreshList(): void {
    this.retrieve();
    this.selectedDoctor = {};
    this.selectedPatient = {};
  }

  setActiveDoctor(doc: Doctor) {
    this.selectedDoctor = doc;
  }

  createHeader() { // todo не нравится (роли)
    if (this.userRole == 'ADMIN') {
      this.header = 'Список пользователей';
    } else this.header = 'Список докторов'
  }

  gotoDoctor(doc: Doctor) {
    this.setActiveDoctor(doc);
    this.router.navigate([`/user/${this.selectedDoctor.id}`]);
  }

  setActivePatient(pat: Patient) {
    this.selectedPatient = pat;
  }

  gotoPatient(pat: Patient) {
    this.setActivePatient(pat);
    this.router.navigate([`/patient/${this.selectedPatient.id}`]);
  }

  private retrieve(): void { //todo роли
    if (this.userRole == 'ADMIN' || this.userRole == 'CHIEF') {
      this.mainService.getAllDoctors(this.authService.user_id).subscribe({
        next: (data) => {
          this.doctors = data["people"];
          this.roles = data['roles'];
          this.peopleIsNull = this.doctors?.length == 0;
        }, error: (e) => {
          e.status == 404 ? this.message = e['error']['message'] : this.message = "Ошибка сервера"
          this.openModal('message_modal');
        }
      });
    } else {
      this.mainService.getAllPatients(this.authService.user_id).subscribe({
        next: (data) => {
          this.patients = data["people"];
          this.peopleIsNull = this.patients?.length == 0;
        }, error: (e) => {
          e.status == 404 ? this.message = e['error']['message'] : this.message = "Ошибка сервера"
          this.openModal('message_modal');
        }
      });
    }
  }

  remove(modal: string, prev_modal: string) {
    this.message = '';
    this.closeModal(prev_modal);
    this.mainService.delete(this.tempID).subscribe({
      next: (res) => {
        this.message = res['message'];
        this.refreshList();
      },
      error: (e) => {
        e.status == 404 ? this.message = e['error']['message'] : this.message = "Ошибка сервера"
      }
    });
    this.openModal(modal);
  }

  getRole(role: string): string {
    return this.roles.find((obj: string) => {
      return obj === role;
    })!;
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  open(id: any, last_name: any, first_name: any, middle_name: any, modal: string) {
    this.openModal(modal);
    this.message = last_name + ' ' + first_name + ' ' + middle_name;
    this.tempID = id;
  }
}
