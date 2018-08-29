import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../services/global';
import { Post } from '../../models/post';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService, PostService]
})
export class SidebarComponent implements OnInit {

  public identity;
  public token;
  public stats;
  public status;
  public url;
  public post: Post;

  @Output() sent = new EventEmitter();

  constructor(
    private _userService: UserService,
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.post = new Post('', this.identity._id, '', '', '');
  }

  ngOnInit() {
  }

  onSubmit(form) {
    this._postService.addPost(this.token, this.post).subscribe(
      response => {
        if (response.post) {
          this.status = 'success';
          form.reset();
          this._router.navigate(['/timeline']);
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

  // Output

  sendPost (event) {
    this.sent.emit({sent: 'true'});
  }
}
