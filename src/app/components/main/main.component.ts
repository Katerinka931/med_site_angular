import {Component, OnInit, Renderer2} from '@angular/core';
import {Doctor} from "../../models/doctor_model/doctor";
import {MainPageService} from "../../services/main_page_service/main-page.service";
import {Patient} from "../../models/patient_model/patient";
import {AuthService} from "../../services/auth_service/auth.service";
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";

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

  message: any;

  constructor(private mainService: MainPageService, private renderer: Renderer2, private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) {
    this.renderer.setStyle(document.body, 'background-color', 'white');
  }

  ngOnInit(): void {
    this.doctor = this.tokenStorage.getUser();
    this.userRole = this.tokenStorage.getUserRole()!;
    this.renderer.setStyle(document.body, 'background-color', 'white');
    this.retrieve();
    this.peopleIsNull = false;
    console.log('userRole ' + this.userRole);
  }

  refreshList(): void {
    this.retrieve();
    this.selectedDoctor = {};
    this.selectedPatient = {};
  }

  setActiveDoctor(doc: Doctor) {
    this.selectedDoctor = doc;
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
      this.mainService.getAllDoctors(this.authService.user_id).subscribe({ //todo
        next: (data) => {
          this.doctors = data["people"];
        }, error: (e) => console.error(e)
      });
    } else {
      this.mainService.getAllPatients(this.authService.user_id).subscribe({
        next: (data) => {
          this.patients = data["people"];
        }, error: (e) => console.error(e)
      });
    }
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

  delete(pk: any): void {
    if (confirm("Вы уверены, что хотите удалить \"" + this.selectedDoctor.last_name + ' ' + "имя" + ' ' + "отчество" + "\"?")) {
      this.mainService.delete(pk).subscribe({
        next: (res) => {
          console.log(res);
          confirm("Удаление успешно");
          this.refreshList();
        },
        error: (e) => {
          console.error(e);
          confirm("Удаление не удалось");
        }
      })
    }
  }
}
