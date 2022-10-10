import {Component, OnInit} from '@angular/core';
import {Patient} from "../../models/patient_model/patient";
import {PatientService} from "../../services/patients_service/patient.service";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.css']
})
export class CreatePatientComponent implements OnInit {
  patient: Patient = {};
  submitted = false;
  userRole: string;

  constructor(private tokenStorage: TokenStorageService, private patientService: PatientService) {
  }

  ngOnInit(): void {
    this.userRole = this.tokenStorage.getUserRole()!;
  }

  savePatient() {
    const data = {
      last_name: this.patient.last_name,
      first_name: this.patient.first_name,
      middle_name: this.patient.middle_name,
      email: this.patient.email,
      phone: this.patient.phone,
      date_of_birth: this.patient.date_of_birth,
      diagnosys: this.patient.diagnosys,
      doctor_number: this.patient.doctor_number
    }
    this.patientService.createPatient(data).subscribe({
      next: (res) => {
        this.submitted = true;
        console.log(res);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }
}
