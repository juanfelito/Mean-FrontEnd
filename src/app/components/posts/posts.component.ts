import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../services/global';
// import $  from 'jquery';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  providers: [UserService, PostService]
})
export class PostsComponent implements OnInit {

  public url: string;
  public identity;
  public token;
  public title: string;
  public page;
  public total;
  public pages;
  public status: string;
  public posts: Post[];
  public itemsPerPage;
  public noMore = false;
  @Input() user: String;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _postService: PostService
  ) {
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.title = 'Timeline';
    this.page = 1;
  }

  ngOnInit() {
    this.getPosts(this.user, this.page);
  }

  getPosts (user, page, adding = false) {
    this._postService.getUserPosts(this.token, user, page).subscribe(
      response => {
        if (response.posts) {
          this.total = response.totalItems;
          this.pages = response.pages;
          this.itemsPerPage = response.itemsPerPage;

          if (!adding) {
            this.posts = response.posts;
          } else {
            let arrayA = this.posts;
            let arrayB = response.posts;

            this.posts = arrayA.concat(arrayB);
            // $('html, body').animate({scrollTop: $('body').prop('scrollHeight')}, 500);
          }

          if (page > this.pages) {
            this._router.navigate(['/home']);
          }
        } else {
          this.status = 'error';
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

  getMore () {
    if (this.posts.length >= (this.total - this.itemsPerPage)) {
      this.noMore = true;
    }

    this.page += 1;
    this.getPosts(this.user, this.page, true);
  }
}