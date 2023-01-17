import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./components/main/main.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {LoginComponent} from "./components/login/login.component";
import {LoadImageComponent} from "./components/load-image/load-image.component";
import {PatientsDataComponent} from "./components/patients-data/patients-data.component";
import {CreateUserComponent} from "./components/create-user/create-user.component";
import {EditUserComponent} from "./components/edit-user/edit-user.component";
import {CreatePatientComponent} from "./components/create-patient/create-patient.component";
import {EditPatientComponent} from "./components/edit-patient/edit-patient.component";
import {UsersDataComponent} from "./components/users-data/users-data.component";
import {PatientsListComponent} from "./components/patients-list/patients-list.component";
import {AuthGuard} from "./auth/auth.guard";
import {NgxPermissionsModule} from "ngx-permissions";

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: "full"},
  { path: 'refresh_token', component: LoginComponent},
  { path: 'logout', component: LoginComponent, canActivate: [AuthGuard]},
  { path: 'main', component: MainComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], canDeactivate: [AuthGuard]},

  { path: 'create_user', component: CreateUserComponent, canActivate: [AuthGuard], data: {role: ['ADMIN', 'CHIEF']}},
  { path: 'edit_user/:usr', component: EditUserComponent, canActivate: [AuthGuard], canDeactivate: [AuthGuard]}, //CHIEF and ADMIN

  { path: 'create_patient', component: CreatePatientComponent, canActivate: [AuthGuard]},
  { path: 'edit_patient/:pat', component: EditPatientComponent, canActivate: [AuthGuard], canDeactivate: [AuthGuard]}, // DOC and OPER

  { path: 'user/:usr', component: UsersDataComponent, canActivate: [AuthGuard]},
  { path: 'patient/:pat', component: PatientsDataComponent, canActivate: [AuthGuard]},
  { path: 'patients', component: PatientsListComponent, canActivate: [AuthGuard], data: {role: 'CHIEF'}},

  { path: 'load_image', component: LoadImageComponent, canActivate: [AuthGuard], data: {role: ['CHIEF', 'DOCTOR']}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes), NgxPermissionsModule.forChild()],
  exports: [RouterModule, NgxPermissionsModule],
  // providers: [AuthGuard]
})
export class AppRoutingModule { }
