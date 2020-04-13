import { Injectable } from '@angular/core';
import { User, Post, PostArray } from '../_models/user.model';
import { environment } from '../_environment/env';
import {HttpClient,} from '@angular/common/http';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class MicroBlogService {
  errorMsg : string = '';
  isloggedIn : boolean = false;

  constructor(private router: Router,private http: HttpClient, private authenticationService: AuthenticationService) {}

  //API calls
  public getUser(username: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/users/`+username)
    .pipe(map(user => {
      //storing user in session
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.isloggedIn = true;
      return user;
  }));
  }
    
  public updateUser(username : string,email : string, about_me : string,user_id:number): Observable<User>{
    let newUser: User = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.about_me = about_me;
    return this.http.put<User>(`${environment.apiUrl}/api/users/${user_id}`,JSON.stringify(newUser))
    .pipe(map(user => {
      localStorage.removeItem("currentUser");
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }))
  }

  public submitPost(user_id : number, post: string): Observable<any>{
    let newPost: Post = new Post();
    newPost.user_id = user_id;
    newPost.body = post;
    return this.http.post<JSON>(`${environment.apiUrl}/api/posts`,JSON.stringify(newPost))
    .pipe(map(response => {
      return response;
    }))
  }

  public registerUser(username : string, email : string , password: string): Observable<any>{
    let newUser: User = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
    return this.http.post<JSON>(`${environment.apiUrl}/api/users`,JSON.stringify(newUser))
    .pipe(map(response => {
      return response;
    }))
  }

  public getPost(username: string,pageno: number): Observable<PostArray> {
    return this.http.get<PostArray>(`${environment.apiUrl}/api/posts/${username}?page=`+pageno)
    .pipe(map(post => {

      return post;
  }));
  }

  public getallPosts(pageno: number): Observable<PostArray> {
    return this.http.get<PostArray>(`${environment.apiUrl}/api/posts?page=`+pageno)
    .pipe(map(post => {
      return post;
  }));
  }
/*
errorHandler(error: HttpErrorResponse) {
  let errorMessage = "Unknown Error!";
  if (error.error instanceof ErrorEvent) {
    // Client-side errors
    errorMessage = `Error: ${error.error.message}`;
  } else {
    // Server-side errors
    //errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    if(error.status == 401)
    {
      errorMessage = "Username and Password is incorrect!";
    }
    else if(error.status == 400)
    {
      errorMessage = "Bad request";
    }
    else
    {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
  }
  return throwError(errorMessage);
}*/
  
}
