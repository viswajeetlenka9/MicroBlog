import { Injectable } from '@angular/core';
import { User,CurrentUser , Post, PostArray } from './user.model';
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
  current_user : CurrentUser = new CurrentUser();
  isloggedIn : boolean = false;
  
  private tokenSubject : BehaviorSubject<string>;
  public user_token : Observable<string>;

  private currentusername_Subject : BehaviorSubject<string>;
  public currentusername : Observable<string>;

  /*
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  private currentUser_postsSubject: BehaviorSubject<PostArray>;
  public currentUser_posts: Observable<PostArray>;

  private allUser_postsSubject: BehaviorSubject<PostArray>;
  public allUser_posts: Observable<PostArray>;
  */
  constructor(private router: Router,private http: HttpClient) {
        this.tokenSubject = new BehaviorSubject<string>(JSON.parse(sessionStorage.getItem('user_token')));
        this.user_token = this.tokenSubject.asObservable();

        this.currentusername_Subject = new BehaviorSubject<string>(JSON.parse(sessionStorage.getItem('currentusername')));
        this.currentusername = this.currentusername_Subject.asObservable();

        /*
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();

        this.currentUser_postsSubject = new BehaviorSubject<PostArray>(JSON.parse(sessionStorage.getItem('currentUser_posts')));
        this.currentUser_posts = this.currentUser_postsSubject.asObservable();

        this.allUser_postsSubject = new BehaviorSubject<PostArray>(JSON.parse(sessionStorage.getItem('allUsers_posts')));
        this.allUser_posts = this.allUser_postsSubject.asObservable();
        */
  }
  public get currentuser_token() : string {
    return this.tokenSubject.value;
  }

  public get currentUsername() : string {
    return this.currentusername_Subject.value;
  }
  /*
  public get currentUserValue() : User {
    return this.currentUserSubject.value;
  }

  public get currentUser_postsValue() : PostArray {
    return this.currentUser_postsSubject.value;
  }

  public get allUser_postsValue() : PostArray {
    return this.allUser_postsSubject.value;
  }
  */

  //API calls
  public getToken(username : string ,password: string): Observable<any>
  {
      this.current_user.current_username = username;
    //this.password = password;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Basic ${window.btoa(username + ':' + password)}`)
    }
    return this.http.post<any>(`${environment.apiUrl}/api/tokens`,{ observe: 'response' }, header)
    .pipe(map(token =>{
      console.log(token);
      sessionStorage.setItem('user_token',JSON.stringify(token.token));
      this.current_user.current_token = token.token;
      return token;
    }),catchError(this.errorHandler));
  }

  public getUser(token: string): Observable<User> {
    this.current_user.current_token = token;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${this.current_user.current_token}`)
    }
    return this.http.get<User>(`${environment.apiUrl}/api/users/`+this.current_user.current_username,header)
    .pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      //sessionStorage.setItem('currentUser', JSON.stringify(user));
      sessionStorage.setItem('currentusername', JSON.stringify(user.username));
      this.current_user.current_user_id = user.id;
      //this.currentUserSubject.next(user);
      this.isloggedIn = true;
      return user;
  }));
  }

  public getotherUser(token: string,other_username: string): Observable<User> {
    this.current_user.current_token = token;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${this.current_user.current_token}`)
    }
    return this.http.get<User>(`${environment.apiUrl}/api/users/`+other_username,header)
    .pipe(map(user => {
      console.log(user);
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      return user;
  }));
  }
  
  
  public updateUser(token: string,username : string,email : string, about_me : string,user_id:number): Observable<User>{
    this.current_user.current_token = token;
    this.current_user.current_user_id = user_id;
    let newUser: User = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.about_me = about_me;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${this.current_user.current_token}`)
      .set('Content-Type', 'application/json')
    }
    return this.http.put<User>(`${environment.apiUrl}/api/users/${this.current_user.current_user_id}`,JSON.stringify(newUser),header)
    .pipe(map(user => {
      console.log(user);
      this.current_user.current_username = user.username;
      //sessionStorage.removeItem('currentUser');
      //this.currentUserSubject.next(null);
      //sessionStorage.setItem('currentUser', JSON.stringify(user));
      //this.currentUserSubject.next(user);
      return user;
    }))
  }

  public submitPost(user_id : number, post: string): Observable<any>{
    let newPost: Post = new Post();
    newPost.user_id = user_id;
    newPost.body = post;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${this.current_user.current_token}`)
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
    console.log(token);
    this.current_user.current_token = token;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${this.current_user.current_token}`)
    }
    return this.http.get<PostArray>(`${environment.apiUrl}/api/posts/${this.current_user.current_username}?page=`+pageno,header)
    .pipe(map(post => {
      // store post details in local storage to keep user posts logged in between page refreshes
      //sessionStorage.setItem('currentUser_posts', JSON.stringify(post));
      //this.currentUser_postsSubject.next(post);
      return post;
  }));
  }

  public getotherUserPost(token: string, pageno: number,other_username: string): Observable<PostArray> {
    this.current_user.current_token = token;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${this.current_user.current_token}`)
    }
    return this.http.get<PostArray>(`${environment.apiUrl}/api/posts/${other_username}?page=`+pageno,header)
    .pipe(map(post => {
      // store post details in local storage to keep user posts logged in between page refreshes
      return post;
  }));
  }

  public getallPosts(token: string,pageno: number): Observable<PostArray> {
    this.current_user.current_token = token;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Bearer ${this.current_user.current_token}`)
    }
    return this.http.get<PostArray>(`${environment.apiUrl}/api/posts?page=`+pageno,header)
    .pipe(map(post => {
      // store post details in local storage to keep user posts logged in between page refreshes
      //sessionStorage.setItem('allUsers_posts', JSON.stringify(post));
      //this.allUser_postsSubject.next(post);
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
    this.current_user.current_token = '';
    this.current_user.current_username = '';
    this.current_user.current_user_id = 0;
    this.isloggedIn = false;
    sessionStorage.removeItem('user_token');
    sessionStorage.removeItem('currentusername');
    
    //sessionStorage.removeItem('currentUser');
    //sessionStorage.removeItem('currentUser_posts');
    //sessionStorage.removeItem('allUsers_posts');
    this.tokenSubject.next(null);
    this.currentusername_Subject.next(null);
    //this.currentUserSubject.next(null);
    //this.currentUser_postsSubject.next(null);
    //this.allUser_postsSubject.next(null);
    
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
