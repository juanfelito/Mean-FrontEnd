import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public title: string;
  public user: User;
  public status: string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.title = 'Log in';
    this.user = new User('', '', '', '', '', '', '', '', '');
  }

  ngOnInit() {
  }

  onSubmit(form) {
    this._userService.login(this.user).subscribe(
      response => {
        this.identity = response.user;
        if (!this.identity || !this.identity._id) {
          this.status = 'error';
        } else {
          this.status = 'success';
          // Persistir datos usuario
          localStorage.setItem('identity', JSON.stringify(this.identity));
          // Conseguir token
          this.getToken();
        }
      },
      error => {
        let errorMessage = <any>error;

        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  getToken() {
    this._userService.login(this.user, 'true').subscribe(
      response => {

        this.token = JSON.stringify(response.token);

        if (this.token.length <= 0) {
          this.status = 'error';
        } else {
          // Persistir token usuario
          localStorage.setItem('token', this.token);
          // Conseguir estadisticas usuario
          this.getCounters();
          // Redireccionar
          this._router.navigate(['/home']);
        }
      },
      error => {
        let errorMessage = <any>error;

        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  getCounters() {
    this._userService.getCounters().subscribe(
      response => {
        localStorage.setItem('stats', JSON.stringify(response));
        this.status = 'success';
      },
      error => {
        this.status = 'error';
      }
    );
  }
}
