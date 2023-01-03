import {Component, OnInit} from '@angular/core';
import {Patient} from "../../models/patient_model/patient";
import {AuthService} from "../../services/auth_service/auth.service";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";
import {PatientService} from "../../services/patients_service/patient.service";
import {Router} from "@angular/router";
import {ModalServiceService} from "../../services/modal_service/modal-service.service";

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
  message: any;
  tempID: any;

  constructor(private patientService: PatientService, private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router, private modalService: ModalServiceService) {
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
      }, error: (e) => {
        e.status == 404 ? this.message = e['error']['message'] : this.message = "Ошибка сервера"
      }
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

  remove(modal: string, prev_modal: string) {
    this.closeModal(prev_modal);
    this.patientService.delete(this.tempID).subscribe({
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
