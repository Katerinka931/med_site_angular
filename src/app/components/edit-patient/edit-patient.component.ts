import {Component, OnInit} from '@angular/core';
import {PatientService} from "../../services/patients_service/patient.service";
import {Patient} from "../../models/patient_model/patient";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {

  currentPatient: Patient;
  currentID = this.route.snapshot.params["pat"];

  constructor(private patientService: PatientService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.retrieve();
  }

  private retrieve(): void {
    this.patientService.getPatient(this.currentID).subscribe({
      next: (data) => {
        this.currentPatient = data["patient"];
      }, error: (e) => console.error(e)
    });
  }

  editPatient(): void {
    this.patientService.editPatient(this.currentID, this.currentPatient)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (e) => {
          console.error(e);
        }
      });
  }
}
