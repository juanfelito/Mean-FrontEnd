import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService, UploadService]
})
export class UserEditComponent implements OnInit {

  public title: string;
  public user: User;
  public status: string;
  public token;
  public identity;
  public filesToUpload: Array <File>;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService
  ) {
    this.title = 'Account information';
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
  }

  onSubmit() {
    this._userService.updateUser(this.user).subscribe(
      response => {
        if (!response.user) {
          this.status = 'error';
        } else {
          this.status = 'success';
          localStorage.setItem('identity', JSON.stringify(response.user));
          this.identity = this.user;
          // Subida de imagen
          this._uploadService.makeFileRequest(this.url + 'upload-user-image/' + this.user._id, [], this.filesToUpload, this.token, 'image')
                                             .then((result: any) => {
                                               console.log(result);
                                               this.user.image = result.user.image;
                                               localStorage.setItem('identity', JSON.stringify(this.user));
                                             });
        }
      },
      error => {
        let errorMessage = <any> error;
        console.log(errorMessage);

        if (errorMessage !== null) {
          this.status = 'error';
        }
      }
    );
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
