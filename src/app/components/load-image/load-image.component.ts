import {Component, OnInit} from '@angular/core';
import {LoadImageService} from "../../services/load_image_service/load-image.service";
import {HttpResponse} from "@angular/common/http";
import {Patient} from "../../models/patient_model/patient";
import {AuthService} from "../../services/auth_service/auth.service";
import {ModalServiceService} from "../../services/modal_service/modal-service.service";
import {Location} from '@angular/common';

import {DomSanitizer} from '@angular/platform-browser';
import {NgxFileDropEntry} from "ngx-file-drop";
import * as FileSaver from "file-saver";
import {TokenStorageService} from "../../services/token_storage_service/token-storage.service";

@Component({
  selector: 'app-load-image',
  templateUrl: './load-image.component.html',
  styleUrls: ['./load-image.component.css']
})

export class LoadImageComponent implements OnInit {
  files: NgxFileDropEntry[] = [];
  currentFile: File;

  file_name = '';
  imagePath: any;
  modifiedDate: any;
  dateToScreen: any;

  patients?: Patient[];
  patientsList: string[] = [];
  selected: any = "=";

  diagnosis = '';
  custom_diagnosis = '';
  message = '';

  access_error: boolean = false;

  public loading = false;
  saved: boolean = false;

  constructor(private loadService: LoadImageService, private authService: AuthService, private modalService: ModalServiceService,
              private domSerializer: DomSanitizer, private location: Location) {
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.imagePath = null;

    this.files = files;

    if (files.length > 1) {
      this.message = "Выберите один файл!";
      this.openModal('message_modal');
    } else {
      let droppedFile = files[0];

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: File) => {
          this.currentFile = file;
          this.file_name = this.currentFile.name;

          this.modifiedDate = file.lastModified; //todo this.selectedFiles[0].lastModified;
          this.dateToScreen = new Date(this.modifiedDate).toLocaleString();
          this.diagnosis = '';
          this.saved = false;
        });

      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: any) {
    console.log(event);
  }

  public fileLeave(event: any) {
    console.log(event);
  }

  ngOnInit(): void {
    this.retrieve();
  }

  private retrieve(): void {
    this.access_error = false;
    this.loadService.getPatients(this.authService.user_id).subscribe({
      next: (data) => {
        this.patients = data["patients"];
        this.patientsToSelector();
      }, error: (e) => {
        if (e.status == 403) {
          this.message = 'Доступ запрещен!';
          this.access_error = true;
        } else
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

  loadImage(modal: string): void {
    this.loading = true;
    this.diagnosis = '';
    this.custom_diagnosis = '';
    this.saved = false;

    this.loadService.upload(this.currentFile, this.modifiedDate).subscribe(
      event => {
        if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.diagnosis = event.body['message'];
          this.imagePath = this.domSerializer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + event.body['file']);
          this.loading = false;
        }
      },
      e => {
        e.status != 500 ? this.message = e['error']['message'] : this.message == "Ошибка сервера";
        this.loading = false;
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
          this.saved = true;
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
    if (this.access_error) {
      this.location.back();
    }
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  download() {
    this.loading = true;
    this.loadService.download(this.selected.split('=')[1].slice(0, -1)).subscribe({
      next: (res) => {
        let name = res['name'];
        let file = res['doc'];
        let byteArrays = this.convert_to_bytearray(file);
        FileSaver.saveAs(new File(byteArrays, name), name);
        this.loading = false;
      },
      error: (e) => {
        this.message = "Не удалось загрузить файл";
        this.openModal('message_modal');
        this.loading = false;
      }
    });
  }

  convert_to_bytearray(file: any) {
    const sliceSize = 1024;
    const byteCharacters = atob(file);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return byteArrays;
  }
}
