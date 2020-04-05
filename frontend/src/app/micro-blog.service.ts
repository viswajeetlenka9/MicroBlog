import { Injectable } from '@angular/core';
import { User, Post } from './user.model';
import { environment } from './env'
import {HttpClient, HttpErrorResponse,HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable, BehaviorSubject, throwError, of} from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MicroBlogService {
  username = '';
  token : string;
  isloggedIn : boolean;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private currentUser_postsSubject: BehaviorSubject<Post[]>;
  public currentUser_posts: Observable<Post[]>;

  constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.currentUser_postsSubject = new BehaviorSubject<Post[]>(JSON.parse(localStorage.getItem('currentUser_posts')));
        this.currentUser_posts = this.currentUser_postsSubject.asObservable();
  }

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
    }
    return throwError(errorMessage);
  }

  public get currentUserValue() : User {
    return this.currentUserSubject.value;
  }

  public get currentUser_postsValue() : Post[] {
    return this.currentUser_postsSubject.value;
  }
  

  //API calls
  public getToken(username : string ,password: string): Observable<any>
  {
      this.username = username;
    //this.password = password;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Basic ${window.btoa(username + ':' + password)}`)
    }
    return this.http.post<any>(`${environment.apiUrl}/api/tokens`,{ observe: 'response' }, header)
    .pipe(catchError(this.errorHandler));
  }

  public getUser(token: string): Observable<User> {
    this.token = token;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${this.token}`)
    }
    return this.http.get<User>(`${environment.apiUrl}/api/users/`+this.username,header)
    .pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.isloggedIn = true;
      return user;
  }));
  }

  public getPost(token: string): Observable<any> {
    this.token = token;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${this.token}`)
    }
    return this.http.get<any>(`${environment.apiUrl}/api/posts/`+this.username,header)
    .pipe(map(post => {
      // store post details in local storage to keep user posts logged in between page refreshes
      localStorage.setItem('currentUser_posts', JSON.stringify(post.items));
      this.currentUser_postsSubject.next(post.items);
      return post;
  }));
  }


  logout() {
    // remove user from local storage to log user out
    this.token = '';
    this.username = '';
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser_posts');
    this.currentUserSubject.next(null);
    this.currentUser_postsSubject.next(null);
    alert('logged out');
}

  
}