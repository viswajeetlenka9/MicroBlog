import { Injectable } from '@angular/core';
import { User, Post, PostArray } from './user.model';
import { environment } from './env'
import {HttpClient, HttpErrorResponse,HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable, BehaviorSubject, throwError, of} from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class MicroBlogService {
  errorMsg : string = '';
  username = '';
  token : string;
  isloggedIn : boolean = false;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private currentUser_postsSubject: BehaviorSubject<PostArray>;
  public currentUser_posts: Observable<PostArray>;
  private allUser_postsSubject: BehaviorSubject<PostArray>;
  public allUser_posts: Observable<PostArray>;

  constructor(private router: Router,private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();

        this.currentUser_postsSubject = new BehaviorSubject<PostArray>(JSON.parse(localStorage.getItem('currentUser_posts')));
        this.currentUser_posts = this.currentUser_postsSubject.asObservable();

        this.allUser_postsSubject = new BehaviorSubject<PostArray>(JSON.parse(localStorage.getItem('allUsers_posts')));
        this.allUser_posts = this.allUser_postsSubject.asObservable();
  }

  public get currentUserValue() : User {
    return this.currentUserSubject.value;
  }

  public get currentUser_postsValue() : PostArray {
    return this.currentUser_postsSubject.value;
  }

  public get allUser_postsValue() : PostArray {
    return this.allUser_postsSubject.value;
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

  public submitPost(user_id : number, post: string): Observable<any>{
    let newPost: Post = new Post();
    newPost.user_id = user_id;
    newPost.body = post;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${this.token}`)
      .set('Content-Type', 'application/json')
    }
    return this.http.post<JSON>(`${environment.apiUrl}/api/posts`,JSON.stringify(newPost),header)
    .pipe(map(response => {
      return response;
    }))
  }

  public registerUser(username : string, email : string , password: string): Observable<any>{
    let newUser: User = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
    var header = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    return this.http.post<JSON>(`${environment.apiUrl}/api/users`,JSON.stringify(newUser),header)
    .pipe(map(response => {
      return response;
    }))
  }

  public getPost(token: string, pageno: number): Observable<PostArray> {
    this.token = token;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${this.token}`)
    }
    return this.http.get<PostArray>(`${environment.apiUrl}/api/posts/${this.username}?page=`+pageno,header)
    .pipe(map(post => {
      // store post details in local storage to keep user posts logged in between page refreshes
      localStorage.setItem('currentUser_posts', JSON.stringify(post));
      this.currentUser_postsSubject.next(post);
      return post;
  }));
  }

  public getallPosts(token: string,pageno: number): Observable<PostArray> {
    this.token = token;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${this.token}`)
    }
    return this.http.get<PostArray>(`${environment.apiUrl}/api/posts?page=`+pageno,header)
    .pipe(map(post => {
      // store post details in local storage to keep user posts logged in between page refreshes
      localStorage.setItem('allUsers_posts', JSON.stringify(post));
      this.allUser_postsSubject.next(post);
      return post;
  }));
  }

  logout() {
    // remove user from local storage to log user out
    this.router.navigate(['/login']);
    //window.location.reload();
    if(this.isloggedIn == true)
    {
      this.errorMsg = "You are logged out";
    }
    else
    {
      this.errorMsg = "Please login to access this page"
    }
    this.token = '';
    this.username = '';
    this.isloggedIn = false;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser_posts');
    localStorage.removeItem('allUsers_posts');
    this.currentUserSubject.next(null);
    this.currentUser_postsSubject.next(null);
    this.allUser_postsSubject.next(null);
    
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
}
  
}
