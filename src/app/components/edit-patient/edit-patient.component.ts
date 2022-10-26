import {Component, OnInit} from '@angular/core';
import {PatientService} from "../../services/patients_service/patient.service";
import {Patient} from "../../models/patient_model/patient";
import {ActivatedRoute} from "@angular/router";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";
import {Doctor} from "../../models/doctor_model/doctor";

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {

  currentPatient: Patient = {};
  currentID = this.route.snapshot.params["pat"];
  userRole: string;
  doctors: string[] = [];
  listOfDoctors: Doctor[];
  selected: any;
  gotMessage: any;
  message: any;

  constructor(private patientService: PatientService, private route: ActivatedRoute, private tokenStorage: TokenStorageService) {
  }

  ngOnInit(): void {
    this.retrieve();
    this.userRole = this.tokenStorage.getUserRole()!;
  }

  private retrieve(): void {
    this.patientService.getPatient(this.currentID).subscribe({
      next: (data) => {
        this.currentPatient = data["patient"];
        this.listOfDoctors = data["doctors"];
        this.doctorsToSelector();

        this.selected = this.currentPatient['doctor']['last_name'] + ' ' + this.currentPatient['doctor']['first_name'] + ' ' + this.currentPatient['doctor']['middle_name'] + ' (ID=' + this.currentPatient['doctor']['id'] + ')';
      }, error: (e) => console.error(e)
    });
  }

  private doctorsToSelector(): void {
    for (let i = 0; i < this.listOfDoctors.length; i++) {
      this.doctors[i] = this.listOfDoctors[i]['last_name']! + ' ' + this.listOfDoctors[i]['first_name'] + ' ' + this.listOfDoctors[i]['middle_name'] + ' (ID=' + this.listOfDoctors[i]['id'] + ')';
    }
  }

  editPatient(): void {
    this.currentPatient.doctor_number = this.selected.split('=')[1].slice(0, -1)
    this.patientService.editPatient(this.currentID, this.currentPatient)
      .subscribe({
        next: (data) => {
          this.gotMessage = true;
          this.message = data['message'];
        },
        error: (e) => {
          this.gotMessage = true;
          console.error(e);
          confirm(e['error']['message']);
        }
      });
  }

  valueChange(event: any) {
    this.selected = event.target.value;
  }
}
