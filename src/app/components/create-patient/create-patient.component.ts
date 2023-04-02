import {Component, OnInit} from '@angular/core';
import {Patient} from "../../models/patient_model/patient";
import {PatientService} from "../../services/patients_service/patient.service";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";
import {Doctor} from "../../models/doctor_model/doctor";
import {ModalServiceService} from "../../services/modal_service/modal-service.service";
import {Location} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.css']
})
export class CreatePatientComponent implements OnInit {
  patient: Patient = {};
  userRole: string;
  message: any;
  doctors: string[] = [];
  listOfDoctors: Doctor[];
  selected: any;
  access_error: boolean = false;

  constructor(private tokenStorage: TokenStorageService, private patientService: PatientService, private modalService: ModalServiceService,
              private location: Location) {
  }

  ngOnInit(): void {
    this.retrieve();
    this.userRole = this.tokenStorage.getUserRole()!;
  }

  private retrieve(): void {
    this.access_error = false;
    this.patientService.getListOfDoctorsToCreatePatient().subscribe({
      next: (data) => {
        this.listOfDoctors = data["doctors"];
        this.doctorsToSelector();
      }, error: (e) => {
        if (e.status == 403) {
          this.message = 'Доступ запрещен!';
          this.access_error = true;
        } else {
          if (e.status == 404)
            this.message = e['error']['message']
          else
            this.message = "Ошибка загрузки данных"
        }
        this.openModal('message_modal');
      }
    });
  }

  valueChange(event: any) {
    this.selected = event.target.value;
    console.log(this.selected);
  }

  private doctorsToSelector(): void {
    for (let i = 0; i < this.listOfDoctors.length; i++
    ) {
      this.doctors[i] = this.listOfDoctors[i]['last_name']! + ' ' + this.listOfDoctors[i]['first_name'] + ' ' + this.listOfDoctors[i]['middle_name'] + ' (ID=' + this.listOfDoctors[i]['id'] + ')';
    }
  }

  savePatient(modal: string) {
    this.access_error = false;
    if (this.selected == undefined && this.userRole != 'DOCTOR') {
      this.message = 'Введите ФИО лечащего врача';
      this.openModal(modal);
    } else {
      let doc;
      this.userRole == 'DOCTOR' ? doc = '' : doc = this.selected.split('=')[1].slice(0, -1)
      let data = {
        last_name: this.patient.last_name,
        first_name: this.patient.first_name,
        middle_name: this.patient.middle_name,
        email: this.patient.email,
        phone: this.patient.phone,
        date_of_birth: this.patient.date_of_birth,
        doctor_number: doc
      }
      this.patientService.createPatient(data).subscribe({
        next: (res) => {
          this.message = res['message'];
        },
        error: (e) => {
          if (e.status == 403) {
            this.message = 'Доступ запрещен!';
            this.access_error = true;
          } else {
            if (e.status == 404)
              this.message = e['error']['message']
            else
              this.message = "Ошибка загрузки данных"
          }
        }
      });
      this.openModal(modal);
    }
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
    if (this.access_error) {
      this.location.back();
    }
  }
}
