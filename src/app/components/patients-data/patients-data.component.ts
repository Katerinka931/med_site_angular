import {Component, OnInit} from '@angular/core';
import {Patient} from "../../models/patient_model/patient";
import {PatientService} from "../../services/patients_service/patient.service";
import {ActivatedRoute} from "@angular/router";
import {Doctor} from "../../models/doctor_model/doctor";
import {Photo} from "../../models/photo-model/photo.model";
import {DomSanitizer} from "@angular/platform-browser";
import {ModalServiceService} from "../../services/modal_service/modal-service.service";
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-patients-data',
  templateUrl: './patients-data.component.html',
  styleUrls: ['./patients-data.component.css']
})
export class PatientsDataComponent implements OnInit {
  patient: Patient = {};
  photo: Photo = {};
  downloaded_photo: Photo = {};
  patients_doctor: Doctor = {};
  photos: any = [];
  deleteID: any;
  message: any;
  photo_title: string;
  photosIsNull: boolean = false;
  currentFile: any;
  public loading = false;

  constructor(private patientService: PatientService, private route: ActivatedRoute, private domSerializer: DomSanitizer,
              private modalService: ModalServiceService) {
  }

  ngOnInit(): void {
    this.retrieve();
  }

  private retrieve(): void {
    this.patientService.getPatientsData(this.route.snapshot.params["pat"]).subscribe({
      next: (data) => {
        this.patient = data["patient"];
        this.patients_doctor = this.patient["doctor"];
        this.photo_title = data['message'];
        try {
          let file = this.getFile(data['photo']);
          if (file == undefined) {
            this.currentFile = null;
            this.photo = {};
          } else {
            this.currentFile = this.domSerializer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + file);
          }
        } catch (Exception) {
        }
      }, error: (e) => {
        e.status != 500 ? this.photo_title = e['error']['message'] : this.photo_title == "Ошибка загрузки";
        this.patient = e['error']["patient"];
        this.patients_doctor = this.patient["doctor"];
      }
    });
  }

  get_photos_data(modal: string) {
    this.patientService.getAllPhotos(this.route.snapshot.params["pat"]).subscribe({
      next: (data) => {
        this.openModal(modal);
        this.photos = [];
        let photo_objects = data['photos'];
        this.photosIsNull = photo_objects.length != 0;
        this.getPhotosList(photo_objects);
      }, error: (e) => {
        this.message = e['error']['message'];
        this.openModal('message_modal');
      }
    });
  }

  openAnotherModal(modal1: string, modal2: string, id: number) {
    this.openModal(modal2);
    this.closeModal(modal1);
    this.deleteID = id;
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  remove(modal: string) {
    this.patientService.removePhoto(this.patient.id, this.deleteID).subscribe({
      next: (res) => {
        this.message = res['message'];
        this.openModal('message_modal');
        this.retrieve();
      },
      error: (e) => {
        this.message = "Удаление не удалось";
        this.openModal('message_modal');
      }
    })
    this.closeModal(modal);
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

  download(ph: any, type: string) {
    this.patientService.download(this.patient.id, ph, type).subscribe({
      next: (res) => {
        let file = res['photo'];
        let name = this.getNameOfFIle(type, res, file);
        let byteArrays = this.convert_to_bytearray(file);
        FileSaver.saveAs(new File(byteArrays, name), name);
      },
      error: (e) => {
        this.message = "Не удалось загрузить файл";
        this.openModal('message_modal');
      }
    });
  }

  getNameOfFIle(type: any, res: any, file: any) {
    if (type == 'image') {
      this.downloaded_photo = this.domSerializer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + file);
      return res['name'] + '.jpeg';
    } else {
      this.downloaded_photo = this.domSerializer.bypassSecurityTrustResourceUrl('data:image/dcm;base64,' + file);
      return res['name'];
    }
  }

  getFile(data: any) {
    if (data != null) {
      this.photo = data;
      return data['photo'];
    } else {
      return undefined;
    }
  }

  getPhotosList(photo_objects: any) {
    for (var i in photo_objects) {
      var photo = photo_objects[i];
      var file = photo['photo']

      this.photos[i] = {
        'id': photo['id'],
        'photo': this.domSerializer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + file),
        'diagnosis': photo['diagnosis'],
        'date': photo['date'],
        'date_of_research': photo['research_date'],
        'researcher': photo['researcher']
      };
    }
  }

  download_docx(ph: any) {
    this.loading = true;
    this.patientService.download_docx(this.patient.id, ph).subscribe({
      next: (res) => {
        let name = res['name'];
        let file = res['doc'];
        let byteArrays = this.convert_to_bytearray(file);
        FileSaver.saveAs(new File(byteArrays, name), name);
        this.loading = false;
      },
      error: (e) => {
        this.message = "Не удалось загрузить файл";
        this.closeModal('photos_info_modal');
        this.openModal('message_modal');
        this.loading = false;
      }
    });
  }
}
