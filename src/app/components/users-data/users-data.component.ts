import {Component, OnInit} from '@angular/core';
import {Doctor} from "../../models/doctor_model/doctor";
import {UserService} from "../../services/users_service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Patient} from "../../models/patient_model/patient";

@Component({
  selector: 'app-users-data',
  templateUrl: './users-data.component.html',
  styleUrls: ['./users-data.component.css']
})
export class UsersDataComponent implements OnInit {
  user: Doctor = {};
  patients?: Patient[];
  selectedPatient: Patient = {};

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.retrieve();
  }

  private retrieve(): void {
    this.userService.getAnotherDoctor(this.route.snapshot.params["usr"]).subscribe({
      next: (data) => {
        this.user = data["user"];
        this.patients = this.user["patients"];
      }, error: (e) => console.error(e)
    });
  }

  refreshList(): void {
    this.retrieve();
    this.selectedPatient = {};
  }

  setActivePatient(pat: Patient) {
    this.selectedPatient = pat;
  }

  gotoPatient(pat: Patient) {
    this.setActivePatient(pat);
    this.router.navigate([`/patient/${this.selectedPatient.id}`]);
  }

  delete(usr: any, id: any) {
    if (confirm("Вы уверены, что хотите удалить \"" + this.selectedPatient.last_name + ' ' + "имя" + ' ' + "отчество" + "\"?")) {
      this.userService.deletePatient(usr, id).subscribe({
        next: (res) => {
          console.log(res);
          confirm("Удаление успешно");
          this.refreshList();
        },
        error: (e) => {
          console.error(e);
          confirm("Удаление не удалось");
        }
      })
    }
  }
}
