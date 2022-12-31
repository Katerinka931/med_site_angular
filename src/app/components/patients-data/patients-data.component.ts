import {Component, OnInit} from '@angular/core';
import {Patient} from "../../models/patient_model/patient";
import {PatientService} from "../../services/patients_service/patient.service";
import {ActivatedRoute} from "@angular/router";
import {Doctor} from "../../models/doctor_model/doctor";
import {Photo} from "../../models/photo-model/photo.model";
import {DomSanitizer} from "@angular/platform-browser";
import {ModalServiceService} from "../../services/modal_service/modal-service.service";

@Component({
  selector: 'app-patients-data',
  templateUrl: './patients-data.component.html',
  styleUrls: ['./patients-data.component.css']
})
export class PatientsDataComponent implements OnInit {
  patient: Patient = {};
  photo: Photo = {};
  patients_doctor: Doctor = {};
  photos: any = [];
  deleteID: any;
  message: any;

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
        this.photo = data['photo'];

        var file = this.photo['photo'];
        if (file == undefined)
          this.currentFile = null;
        else
          this.currentFile = this.domSerializer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + file);
      }, error: (e) => console.error(e)
    });
  }

  get_photos_data(modal: string) {
    this.openModal(modal);
    this.photos = [];
    this.patientService.getAllPhotos(this.route.snapshot.params["pat"], 1).subscribe({
      next: (data) => {
        var photo_objects = data['photos'];
        for (var i in photo_objects) {
          var photo = photo_objects[i];
          var file = photo['photo']
          this.photos[i] = {
            'id': photo['id'],
            'photo': this.domSerializer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + file),
            'diagnosys': photo['diagnosys'],
            'date': photo['date']
          };
        }
      }, error: (e) => console.error(e)
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
}
