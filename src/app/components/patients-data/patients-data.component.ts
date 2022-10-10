import { Component, OnInit } from '@angular/core';
import {Patient} from "../../models/patient_model/patient";

@Component({
  selector: 'app-patients-data',
  templateUrl: './patients-data.component.html',
  styleUrls: ['./patients-data.component.css']
})
export class PatientsDataComponent implements OnInit {
  patient: Patient = {};

  constructor() { }

  ngOnInit(): void {

  }

}
