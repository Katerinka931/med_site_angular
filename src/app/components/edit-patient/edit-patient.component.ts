import {Component, OnInit} from '@angular/core';
import {PatientService} from "../../services/patients_service/patient.service";
import {Patient} from "../../models/patient_model/patient";
import {ActivatedRoute} from "@angular/router";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";
import {Doctor} from "../../models/doctor_model/doctor";
import {ModalServiceService} from "../../services/modal_service/modal-service.service";
import {Photo} from "../../models/photo-model/photo.model";
import {HttpResponse} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {Location} from '@angular/common';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {

  currentPatient: Patient = {};
  currentID = this.route.snapshot.params["pat"];
  userRole: string;
  doctors: string[] = [];
  listOfDoctors: Doctor[];
  selected: any;
  message: any;
  photo: Photo = {};
  isPhotoExists: boolean = false;
  gotSuccess: any;
  file_name: string;
  imagePath: any;
  modifiedDate: any;
  selectedFiles: FileList;
  currentFile: File;
  diagnosis: string;
  photo_inst: number = 0;
  access_error: boolean = false;

  constructor(private patientService: PatientService, private route: ActivatedRoute, private tokenStorage: TokenStorageService,
              private modalService: ModalServiceService, private domSerializer: DomSanitizer, private location: Location) {
  }

  ngOnInit(): void {
    this.retrieve();
    this.userRole = this.tokenStorage.getUserRole()!;
  }

  private retrieve(): void {
    this.access_error = false;
    this.patientService.getPatient(this.currentID).subscribe({
      next: (data) => {
        this.currentPatient = data["patient"];
        this.listOfDoctors = data["doctors"];
        this.doctorsToSelector();
        this.selected = this.currentPatient['doctor']['last_name'] + ' ' + this.currentPatient['doctor']['first_name'] + ' ' + this.currentPatient['doctor']['middle_name'] + ' (ID=' + this.currentPatient['doctor']['id'] + ')';
        if (data['photo'] != null) {
          this.photo = data['photo'];
          this.modifiedDate = this.photo.date_of_creation;
          this.isPhotoExists = true;
          this.imagePath = this.domSerializer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.photo.photo);
        } else {
          this.isPhotoExists = false;
        }
      }, error: (e) => {
        if (e.status == 403) {
          this.message = 'Доступ запрещен!';
          this.access_error = true;
        } else {
          if (e.status == 404)
            this.message = e['error']['message']
          else{
            this.message = "Ошибка загрузки данных"
            this.access_error = true;
          }
        }
        this.openModal('message_modal');
      }
    });
  }

  private doctorsToSelector(): void {
    for (let i = 0; i < this.listOfDoctors.length; i++) {
      this.doctors[i] = this.listOfDoctors[i]['last_name']! + ' ' + this.listOfDoctors[i]['first_name'] + ' ' + this.listOfDoctors[i]['middle_name'] + ' (ID=' + this.listOfDoctors[i]['id'] + ')';
    }
  }

  editPatient(modal: string): void {
    this.currentPatient.doctor_number = this.selected.split('=')[1].slice(0, -1)
    const data = {
      diagnosis: this.photo.diagnosis,
      patient: this.currentPatient,
    }
    this.patientService.editPatient(this.currentID, data)
      .subscribe({
        next: (data) => {
          this.message = data['message'];
        },
        error: (e) => {
          e.status != 500 ? this.message = e['error']['message'] : this.message == "Ошибка сервера";
        }
      });
    this.openModal(modal);
  }

  valueChange(event: any) {
    this.selected = event.target.value;
  }

  openModal(id: string) {
    this.cleanModal();
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
    if (this.access_error) {
      this.location.back();
    } else {
      this.retrieve();
    }
  }

  cleanModal() {
    this.currentFile = {} as File;
    this.selectedFiles = {} as FileList;
    this.file_name = '';
  }

  saveImageInstance(modal: string) {
    if (this.currentFile.name == undefined) {
      this.photo_inst = this.photo.id!;
      this.modifiedDate = this.photo.date_of_creation;
    } else {
      this.photo_inst = 0;
    }
    this.patientService.loadImage(this.currentFile, this.currentID, this.photo.diagnosis!, this.modifiedDate, this.photo_inst.toString()).subscribe(
      event => {
        if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.diagnosis = event.body['message'];
          this.photo = event.body['photo'];
          this.imagePath = this.domSerializer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + this.photo.photo);
          this.gotSuccess = true;
          this.cleanModal();
        }
      },
      e => {
        e.status != 500 ? this.message = e['error']['message'] : this.message == "Ошибка сервера";
        this.gotSuccess = false;
      });
  }

  selectFile(event: any) {
    this.imagePath = null;
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.length > 1) {
      this.message = "Выберите один файл!";
      this.openModal('message_modal');
    } else {
      this.file_name = this.selectedFiles[0]!.name.split('.')[0];
      this.modifiedDate = this.selectedFiles[0].lastModified;
      this.currentFile = this.selectedFiles[0];
    }
  }
}
