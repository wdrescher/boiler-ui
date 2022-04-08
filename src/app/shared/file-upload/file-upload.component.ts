import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { UserStateService } from 'src/app/services/user-state.service';

@Component({
  selector: 'tattoo-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() displaySize: number = 100; 
  @Input() roundDisplay: boolean = false; 
  @Input() displayPreview: boolean = true; 
  @Output() fileEvent = new EventEmitter<File>();
  imgURL: string | ArrayBuffer; 
  @Input() file: File; 
  @Input() accept: string = "image/*";
  @Input() clearFile?: Subject<boolean>; 
  @Input() uploadLoading?: Subject<boolean>; 

  constructor(
    private _userStateService: UserStateService, 
  ) { }

  id = Math.random().toString(36).substring(7);
  isLoading: boolean = false; 

  ngOnInit(): void {
    if (!!this.clearFile) {
      this.clearFile.subscribe((clearFile: boolean) => {
        if (clearFile) {
          this.removeImage(); 
        }
      })
    }
    if (!!this.file) {
      this.handleFileInput(this.file); 
    }
    if (!!this.uploadLoading) {
      this.uploadLoading.subscribe(
        isLoading => {
          this.isLoading = isLoading; 
        }
      )
    }
    this._userStateService.$newContentStream.subscribe((file) => {
      this.file = file; 
      this.handleFileInput(file); 
    })
  }

  handleFileInput(file): void {
    this.fileEvent.emit(file); 
    var reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

  removeImage(): void {
    this.imgURL = undefined; 
    this.fileEvent.emit(undefined); 
  }
}
