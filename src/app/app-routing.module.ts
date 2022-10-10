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


const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: "full"},
  { path: 'refresh_token', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'main', component: MainComponent},
  { path: 'profile', component: ProfileComponent },

  { path: 'create_user', component: CreateUserComponent},
  { path: 'edit_user/:usr', component: EditUserComponent},

  { path: 'create_patient', component: CreatePatientComponent},
  { path: 'edit_patient/:pat', component: EditPatientComponent},

  { path: 'user/:usr', component: UsersDataComponent },
  { path: 'patient/:pat', component: PatientsDataComponent },
  { path: 'patients', component: PatientsListComponent},

  { path: 'load_image', component: LoadImageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
