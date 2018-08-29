import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService, FollowService]
})
export class UsersComponent implements OnInit {

  public title: string;
  public identity;
  public token;
  public page;
  public nextPage;
  public prevPage;
  public status: string;
  public total;
  public pages;
  public users: User[];
  public url;
  public follows;
  public followUserOver;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {
    this.title = 'People';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this._route.params.subscribe((data) => {
      this.currentPage();
      this.getUsers(this.page);
      // this.changeDetector.detectChanges();
    });
  }

  ngOnInit() {
  }

  currentPage () {
    this._route.params.subscribe((params) => {
      let page = +params['page'];
      this.page = page;

      if (!params['page']) {
        page = 1;
        this.page = page;
      }

      if (!page) {
        page = 1;
        this.page = page;
      } else {
        this.page = page;
        this.nextPage = page + 1;
        this.prevPage = page - 1;
        if (this.prevPage <= 0) {
          this.prevPage = 1;
        }
      }
    });

  }

  getUsers (page) {
    this._userService.getUsers(page).subscribe(
      response => {
        if (!response.users) {
          this.status = 'error';
        } else {
          this.status = 'success';
          this.total = response.total;
          this.pages = response.pages;
          this.users = response.users;
          this.follows = response.following;
          if (page > this.pages) {
            this._router.navigate(['/people']);
          }
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

  mouseEnter (user_id) {
    this.followUserOver = user_id;
  }

  mouseLeave (user_id) {
    this.followUserOver = 0;
  }

  followUser (followed) {
    let follow = new Follow('', '', followed);
    this._followService.addFollow(this.token, follow).subscribe(
      response => {
        if (!response.follow) {
          this.status = 'error';
        } else {
          this.status = 'success';
          this.follows.push(follow.followed);
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

  unfollowUser (followed) {
    this._followService.deleteFollow(this.token, followed).subscribe(
      response => {
        let i = this.follows.indexOf(followed);

        if (i !== -1) {
          this.follows.splice(i, 1);
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

}
