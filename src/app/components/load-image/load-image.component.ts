import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {LoadImageService} from "../../services/load_image_service/load-image.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-load-image',
  templateUrl: './load-image.component.html',
  styleUrls: ['./load-image.component.css']
})
export class LoadImageComponent implements OnInit {

  selectedFiles: FileList;
  currentFile: File;
  message = '';

  diagnosys = '';

  fileInfos: Observable<any>;

  constructor(private loadService: LoadImageService) {
  }

  ngOnInit(): void {
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
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
        this.message = 'Could not upload the file!';
      });
  }

  saveDiagnosys() {

  }
}
