import { Component, OnInit } from '@angular/core';
import {Doctor} from "../../models/doctor_model/doctor";

@Component({
  selector: 'app-users-data',
  templateUrl: './users-data.component.html',
  styleUrls: ['./users-data.component.css']
})
export class UsersDataComponent implements OnInit {
  user: Doctor = {};

  constructor() { }

  ngOnInit(): void {
  }

}
