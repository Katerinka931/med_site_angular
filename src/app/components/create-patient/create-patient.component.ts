import {Component, OnInit} from '@angular/core';
import {Patient} from "../../models/patient_model/patient";
import {PatientService} from "../../services/patients_service/patient.service";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";
import {Doctor} from "../../models/doctor_model/doctor";

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.css']
})
export class CreatePatientComponent implements OnInit {
  patient: Patient = {};
  submitted = false;
  userRole: string;
  message: any;
  doctors: string[] = [];
  listOfDoctors: Doctor[];
  selected: any;

  constructor(private tokenStorage: TokenStorageService, private patientService: PatientService) {
  }

  ngOnInit(): void {
    this.retrieve();
    this.userRole = this.tokenStorage.getUserRole()!;
  }

  private retrieve(): void {
    this.patientService.getListOfDoctorsToCreatePatient().subscribe({
      next: (data) => {
        this.listOfDoctors = data["doctors"];
        this.doctorsToSelector();
      }, error: (e) => {
        console.error(e);
      }
    });
  }

  valueChange(event: any) {
    this.selected = event.target.value;
    console.log(this.selected);
  }

  private doctorsToSelector(): void {
    for (let i = 0; i < this.listOfDoctors.length; i++) {
      this.doctors[i] = this.listOfDoctors[i]['last_name']! + ' ' + this.listOfDoctors[i]['first_name'] + ' ' + this.listOfDoctors[i]['middle_name'] + ' (ID=' + this.listOfDoctors[i]['id'] + ')';
    }
  }

  savePatient() {
    if (this.patient.diagnosys == undefined)
      this.patient.diagnosys = '';

    if (this.selected == undefined)
      confirm('Введите ФИО лечащего врача');
    else {
      const data = {
        last_name: this.patient.last_name,
        first_name: this.patient.first_name,
        middle_name: this.patient.middle_name,
        email: this.patient.email,
        phone: this.patient.phone,
        date_of_birth: this.patient.date_of_birth,
        diagnosys: this.patient.diagnosys,
        doctor_number: this.selected.split('=')[1].slice(0, -1)
      }
      this.patientService.createPatient(data).subscribe({
        next: (res) => {
          this.submitted = true;
          this.message = res['message'];
        },
        error: (e) => {
          confirm(e['error']['message']);
        }
      });
    }
  }
}
