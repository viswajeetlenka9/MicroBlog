import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse,HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable, BehaviorSubject, throwError, of} from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import * as moment from "moment";

import { environment } from '../_environment/env';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public username : string;
  constructor(private http: HttpClient) {
    
   }

  public get_token_from_api(username : string ,password: string): Observable<any>
  {
    console.log('inside authentication service');
    this.username = username;
    var header = {
      headers: new HttpHeaders().set('Authorization',  `Basic ${window.btoa(username + ':' + password)}`)
    }
    return this.http.post<any>(`${environment.apiUrl}/api/tokens`,{observe:"response"},header)
    .pipe(map((res) => {
      this.setSession(res);
      console.log(res);
      return res;
    }),catchError(this.errorHandler));
  }

  public get_auth_token(): string{
    const idToken = localStorage.getItem("id_token");
    return idToken;
  }

  private setSession(authResult) {
    console.log(authResult);
    const expiresAt = moment().add(authResult.expiration,'second');
    console.log(expiresAt);
    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }

  logout() {
    if(localStorage.getItem('id_token')){
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("currentUser");
      if (!localStorage.getItem('foo')) { 
        localStorage.setItem('foo', 'no reload') 
        location.reload() 
      } else {
        localStorage.removeItem('foo') 
      }
    }
  }

  public isLoggedIn() {
    const token = localStorage.getItem("id_token");
    if(token){
      return true;
    }
    else{
      return moment().isBefore(this.getExpiration());
    }
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  errorHandler(error: HttpErrorResponse) {
    let errorMessage = "Unknown Error!";
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } 
    else {
      if(error.status == 401)
      {
        errorMessage = "Username and Password is incorrect!";
      }
      else if(error.status == 400)
      {
        errorMessage = "Bad request";
      }
    }
    return throwError(errorMessage);
  }
}
