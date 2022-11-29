import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from './components/main/main.component';
import {ProfileComponent} from './components/profile/profile.component';
import {PatientsDataComponent} from './components/patients-data/patients-data.component';
import {LoadImageComponent} from './components/load-image/load-image.component';
import {LoginComponent} from './components/login/login.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

import {authInterceptorProviders} from './helper/auth.interceptor';
import {CreateUserComponent} from './components/create-user/create-user.component';
import {EditUserComponent} from './components/edit-user/edit-user.component';
import {CreatePatientComponent} from './components/create-patient/create-patient.component';
import {EditPatientComponent} from './components/edit-patient/edit-patient.component';
import {UsersDataComponent} from './components/users-data/users-data.component';
import { PatientsListComponent } from './components/patients-list/patients-list.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ProfileComponent,
    PatientsDataComponent,
    LoadImageComponent,
    LoginComponent,
    CreatePatientComponent,
    CreateUserComponent,
    EditUserComponent,
    EditPatientComponent,
    UsersDataComponent,
    PatientsListComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
