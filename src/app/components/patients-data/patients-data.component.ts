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

  constructor(private patientService: PatientService, private route: ActivatedRoute, private domSerializer: DomSanitizer, private modalService: ModalServiceService) {
  }

  ngOnInit(): void {
    this.retrieve();
  }

  currentFile: any;

  private retrieve(): void {
    this.patientService.getPatientsData(this.route.snapshot.params["pat"]).subscribe({
      next: (data) => {
        this.patient = data["patient"];
        this.patients_doctor = this.patient["doctor"];
        this.photo_title = data['message'];

        try {
          let file;
          let recv_photo = data['photo'];
          if (recv_photo != null) {
            this.photo = recv_photo;
            file = this.photo['photo'];
          } else {
            file = undefined;
          }

          if (file == undefined)
            this.currentFile = null;
          else
            this.currentFile = this.domSerializer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + file);
        } catch (Exception) { }
      }, error: (e) => {
        e.status != 500 ? this.photo_title = e['error']['message'] : this.photo_title == "Ошибка загрузки";
        this.patient = e['error']["patient"];
        this.patients_doctor = this.patient["doctor"];
      }
    });
  }

  get_photos_data(modal: string) {
    this.openModal(modal);
    this.photos = [];
    this.patientService.getAllPhotos(this.route.snapshot.params["pat"]).subscribe({
      next: (data) => {
        var photo_objects = data['photos'];
        for (var i in photo_objects) {
          var photo = photo_objects[i];
          var file = photo['photo']
          this.photos[i] = {
            'id': photo['id'],
            'photo': this.domSerializer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + file),
            'diagnosis': photo['diagnosis'],
            'date': photo['date']
          };
        }
      }, error: (e) => {
        this.message == "Ошибка сервера";
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
    let name;
    this.patientService.download(this.patient.id, ph, type).subscribe({
      next: (res) => {
        console.log('success \n' + res);
        let file = res['photo'];

        if (type == 'image') {
          name = res['name'] + '.jpeg';
          this.downloaded_photo = this.domSerializer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + file);
        } else {
          name = res['name'];
          this.downloaded_photo = this.domSerializer.bypassSecurityTrustResourceUrl('data:image/dcm;base64,' + file);
        }
        let byteArrays = this.convert_to_bytearray(file);
        FileSaver.saveAs(new File(byteArrays, name), name);
      },
      error: (e) => {
        this.message = "Не удалось загрузить файл";
        this.openModal('message_modal');
      }
    });
  }
}
