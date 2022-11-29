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


  constructor(private mainService: MainPageService, private renderer: Renderer2, private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router, private modalService: ModalServiceService) {
    this.renderer.setStyle(document.body, 'background-color', 'white');
  }

  ngOnInit(): void {
    this.doctor = this.tokenStorage.getUser();
    this.userRole = this.tokenStorage.getUserRole()!;
    this.renderer.setStyle(document.body, 'background-color', 'white');
    this.retrieve();
    this.peopleIsNull = false;
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

  createHeader() {
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

  private retrieve(): void {
    if (this.userRole == 'ADMIN' || this.userRole == 'CHIEF') {
      this.mainService.getAllDoctors(this.authService.user_id).subscribe({
        next: (data) => {
          this.doctors = data["people"];
        }, error: (e) => console.error(e)
      });
    } else {
      this.mainService.getAllPatients(this.authService.user_id).subscribe({
        next: (data) => {
          this.patients = data["people"];
          console.log(this.patients);
        }, error: (e) => console.error(e)
      });
    }
  }

  roleTo(role: string): string {
    let newRole = '';
    switch (role) {
      case 'ADMIN':
        newRole = 'администратор';
        break;
      case 'OPERATOR':
        newRole = 'оператор';
        break;
      case 'CHIEF':
        newRole = 'главный врач';
        break;
      case 'DOCTOR':
        newRole = 'врач';
        break;
    }
    return newRole;
  }

  private checkFound(data: Doctor[]) {
    if (data == null) {
      this.peopleIsNull = true;
      this.message = 'Записи не найдены';
    } else {
      this.peopleIsNull = false;
      this.doctors = data;
    }
  }

  delete(pk: any, last: any, first: any, middle: any, modal: string): void {
    if (confirm("Вы уверены, что хотите удалить человека с именем\"" + last + ' ' + first + ' ' + middle + "\"?")) {
      this.mainService.delete(pk).subscribe({
        next: (res) => {
          this.message = "Удаление успешно";
          this.refreshList();
        },
        error: (e) => {
          this.message = "Удаление не удалось";
        }
      })
      this.openModal(modal);
    }
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

  remove(modal: string, prev_modal: string) {
    this.closeModal(prev_modal);
    this.mainService.delete(this.tempID).subscribe({
      next: (res) => {
        this.message = "Удаление успешно";
        this.refreshList();
      },
      error: (e) => {
        this.message = "Удаление не удалось";
      }
    });
    this.openModal(modal);
  }
}
