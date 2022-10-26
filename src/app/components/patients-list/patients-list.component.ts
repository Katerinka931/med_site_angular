import {Component, OnInit} from '@angular/core';
import {Patient} from "../../models/patient_model/patient";
import {MainPageService} from "../../services/main_page_service/main-page.service";
import {AuthService} from "../../services/auth_service/auth.service";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";
import {PatientService} from "../../services/patients_service/patient.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  peopleIsNull: boolean;
  patients?: Patient[];
  selectedPatient: Patient = {};
  patient: Patient = {};

  constructor(private patientService: PatientService, private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) {
  }

  ngOnInit(): void {
    this.retrieve();
  }

  private retrieve(): void {
    this.patientService.getPatients(this.authService.user_id).subscribe({
      next: (data) => {
        this.patients = data["people"];
        if (this.patients?.length == 0)
          this.peopleIsNull = true;
      }, error: (e) => console.error(e)
    });
  }

  setActivePatient(pat: Patient) {
    this.selectedPatient = pat;
  }
  gotoPatient(pat: Patient) {
    this.setActivePatient(pat);
    this.router.navigate([`/patient/${this.selectedPatient.id}`]);
  }

  refreshList(): void {
    this.retrieve();
    this.selectedPatient = {};
  }

  delete(pk: any, last: any, first: any, middle: any) {
    if (confirm("Вы уверены, что хотите удалить человека с именем\"" + last + ' ' + first + ' ' + middle + "\"?")) {
      this.patientService.delete(pk).subscribe({
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
