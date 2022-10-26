import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {LoadImageService} from "../../services/load_image_service/load-image.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {Patient} from "../../models/patient_model/patient";
import {Doctor} from "../../models/doctor_model/doctor";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";
import {AuthService} from "../../services/auth_service/auth.service";

@Component({
  selector: 'app-load-image',
  templateUrl: './load-image.component.html',
  styleUrls: ['./load-image.component.css']
})
export class LoadImageComponent implements OnInit {

  selectedFiles: FileList;
  currentFile: File;
  file_name = '';
  fileInfos: Observable<any>;

  patient: Patient = {};
  patients?: Patient[];
  patientsList: string[] = [];
  selected: any;

  diagnosys = '';
  message = '';

  constructor(private loadService: LoadImageService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.retrieve();
  }

  private retrieve(): void {
    this.loadService.getPatients(this.authService.user_id).subscribe({
      next: (data) => {
        this.patients = data["patients"];
        this.patientsToSelector();
        console.log(data);
      }, error: (e) => console.error(e)
    });
  }

  private patientsToSelector(): void {
    for (let i = 0; i < this.patients?.length!; i++) {
      this.patientsList[i] = this.patients![i]['last_name'] + ' ' + this.patients![i]['first_name'] + ' ' + this.patients![i]['middle_name'] + ' (ID=' + this.patients![i]['id'] + ')';
    }
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.length > 1) {
      confirm("Выберите один файл!");
    } else {
      this.file_name = this.selectedFiles[0]!.name.split('.')[0];
    }
  }

  loadImage(): void {
    this.currentFile = this.selectedFiles[0];
    this.diagnosys = '';

    this.loadService.upload(this.currentFile).subscribe(
      event => {
        if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.diagnosys = event.body['result'];
          // console.log(event.body['image']);
        }
      },
      err => {
        this.message = 'Не удалось загрузить файл';
      });
  }

  saveDiagnosys() {
    const data = {
      diagnosys: this.diagnosys,
      pat_id: this.selected.split('=')[1].slice(0, -1),
      photo: '' // todo
    }

    this.loadService.save(data, 'save').subscribe({
      next: (data) => {
          this.message = data['message'];
        },
        error: (e) => {
          console.error(e);
          confirm(e['error']['message']);
        }
    });
  }

  valueChange(event: any) {
    this.selected = event.target.value;
  }
}
