import {Component, OnInit} from '@angular/core';
import {Patient} from "../../models/patient_model/patient";
import {PatientService} from "../../services/patients_service/patient.service";
import {ActivatedRoute} from "@angular/router";
import {Doctor} from "../../models/doctor_model/doctor";

@Component({
  selector: 'app-patients-data',
  templateUrl: './patients-data.component.html',
  styleUrls: ['./patients-data.component.css']
})
export class PatientsDataComponent implements OnInit {
  patient: Patient = {};
  patients_doctor: Doctor = {};

  constructor(private patientService: PatientService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.retrieve();
  }

  private retrieve(): void {
    this.patientService.getPatientsData(this.route.snapshot.params["pat"]).subscribe({
      next: (data) => {
        this.patient = data["patient"];
        this.patients_doctor = this.patient["doctor"];
      }, error: (e) => console.error(e)
    });
  }
}
