import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { GLOBAL } from './global';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  public url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addPost (token, post: Post): Observable <any> {
    let params = JSON.stringify(post);
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                   .set('Authorization', token);
    return this._http.post(this.url + 'post', params, {headers: headers});
  }

  getPosts (token, page = 1): Observable <any> {
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                   .set('Authorization', token);
    return this._http.get(this.url + 'posts/' + page, {headers: headers});
  }

  getUserPosts (token, user_id, page = 1): Observable <any> {
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                   .set('Authorization', token);
    return this._http.get(this.url + 'user-posts/' + user_id + '/' + page, {headers: headers});
  }

  deletePost (token, id): Observable <any> {
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                   .set('Authorization', token);
    return this._http.delete(this.url + 'post/' + id, {headers: headers});
  }
}
