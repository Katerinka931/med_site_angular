import {Component, OnInit} from '@angular/core';
import {Patient} from "../../models/patient_model/patient";
import {PatientService} from "../../services/patients_service/patient.service";
import {ActivatedRoute} from "@angular/router";
import {Doctor} from "../../models/doctor_model/doctor";
import {Photo} from "../../models/photo-model/photo.model";

@Component({
  selector: 'app-patients-data',
  templateUrl: './patients-data.component.html',
  styleUrls: ['./patients-data.component.css']
})
export class PatientsDataComponent implements OnInit {
  patient: Patient = {};
  photo: Photo = {};
  patients_doctor: Doctor = {};

  constructor(private patientService: PatientService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.retrieve();
  }
  currentFile: File;
  private retrieve(): void {
    this.patientService.getPatientsData(this.route.snapshot.params["pat"]).subscribe({
      next: (data) => {
        this.patient = data["patient"];

        this.photo = data['image']; //todo

        this.currentFile = data['photo']['photo'];

        console.log(data);
        console.log('currentFile=' + this.currentFile);

        this.patients_doctor = this.patient["doctor"];
        if (this.patient.diagnosys == '')
          this.patient.diagnosys = 'отсутствует';
      }, error: (e) => console.error(e)
    });
  }
}
