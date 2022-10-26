import {Component, OnInit} from '@angular/core';
import {Doctor} from "../../models/doctor_model/doctor";
import {UserService} from "../../services/users_service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Patient} from "../../models/patient_model/patient";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";

@Component({
  selector: 'app-users-data',
  templateUrl: './users-data.component.html',
  styleUrls: ['./users-data.component.css']
})
export class UsersDataComponent implements OnInit {
  user: Doctor = {};
  patients?: Patient[];
  selectedPatient: Patient = {};
  role: string;
  currentUserRole: string;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private tokenStorage: TokenStorageService) {
  }

  ngOnInit(): void {
    this.retrieve();
    this.currentUserRole = this.tokenStorage.getUserRole()!;
  }

  private retrieve(): void {
    this.userService.getAnotherDoctor(this.route.snapshot.params["usr"]).subscribe({
      next: (data) => {
        this.user = data["user"];
        this.patients = this.user["patients"];
        this.getRole();
      }, error: (e) => console.error(e)
    });

  }

  private getRole(): void {
    switch (this.user.role) {
      case 'ADMIN':
        this.role = 'администратор';
        break;
      case 'OPERATOR':
        this.role = 'оператор';
        break;
      case 'CHIEF':
        this.role = 'главный врач';
        break;
      case 'DOCTOR':
        this.role = 'врач';
        break;
    }
  }

  refreshList(): void {
    this.retrieve();
    this.selectedPatient = {};
  }

  setActivePatient(pat: Patient) {
    this.selectedPatient = pat;
  }

  gotoPatient(pat: Patient) {
    console.log(this.user.role);
    if (this.tokenStorage.getUserRole() != 'ADMIN') {
      this.setActivePatient(pat);
      this.router.navigate([`/patient/${this.selectedPatient.id}`]);
    }
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
