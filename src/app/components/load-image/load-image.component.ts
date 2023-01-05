import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {LoadImageService} from "../../services/load_image_service/load-image.service";
import {HttpResponse} from "@angular/common/http";
import {Patient} from "../../models/patient_model/patient";
import {AuthService} from "../../services/auth_service/auth.service";
import {ModalServiceService} from "../../services/modal_service/modal-service.service";


import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-load-image',
  templateUrl: './load-image.component.html',
  styleUrls: ['./load-image.component.css']
})
export class LoadImageComponent implements OnInit {

  selectedFiles: FileList;
  currentFile: File;
  file_name = '';
  imagePath: any;
  modifiedDate: any;

  patients?: Patient[];
  patientsList: string[] = [];
  selected: any = "=";

  diagnosis = '';
  custom_diagnosis = '';
  message = '';

  constructor(private loadService: LoadImageService, private authService: AuthService, private modalService: ModalServiceService,
              private domSerializer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.retrieve();
  }

  private retrieve(): void {
    this.loadService.getPatients(this.authService.user_id).subscribe({
      next: (data) => {
        this.patients = data["patients"];
        this.patientsToSelector();
      }, error: (e) => {
        this.message = "Ошибка сервера";
        this.openModal('message_modal')
      }
    });
  }

  private patientsToSelector(): void {
    for (let i = 0; i < this.patients?.length!; i++) {
      this.patientsList[i] = this.patients![i]['last_name'] + ' ' + this.patients![i]['first_name'] + ' ' + this.patients![i]['middle_name'] + ' (ID=' + this.patients![i]['id'] + ')';
    }
  }

  selectFile(event: any): void {
    this.imagePath = null;
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.length > 1) {
      this.message = "Выберите один файл!";
      this.openModal('message_modal');
    } else {
      this.file_name = this.selectedFiles[0]!.name.split('.')[0];
      this.modifiedDate = this.selectedFiles[0].lastModified;
      this.diagnosis = '';
    }
  }

  loadImage(modal: string): void {
    this.currentFile = this.selectedFiles[0];
    this.diagnosis = '';
    this.custom_diagnosis = '';

    this.loadService.upload(this.currentFile, this.modifiedDate).subscribe(
      event => {
        if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.diagnosis = event.body['message'];
          this.imagePath = this.domSerializer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + event.body['file']);
        }
      },
      e => {
        e.status != 500 ? this.message = e['error']['message'] : this.message == "Ошибка сервера";
        this.openModal(modal);
      });
  }

  saveDiagnosis(modal: string) {
    const data = {
      diagnosis: this.diagnosis,
      custom_diagnosis: this.custom_diagnosis,
      pat_id: this.selected.split('=')[1].slice(0, -1),
      date: this.modifiedDate
    }
    this.loadService.save(data, this.currentFile).subscribe({
      next: (data) => {
        if (data instanceof HttpResponse) {
          this.message = data.body['message'];
          this.openModal(modal);
        }
      },
      error: (e) => {
        e.status != 500 ? this.message = e['error']['message'] : this.message == "Ошибка сервера";
        this.openModal(modal);
      }
    });
  }

  valueChange(event: any) {
    this.selected = event.target.value;
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  openModal(id: string) {
    this.modalService.open(id);
  }
}
