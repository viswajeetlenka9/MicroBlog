import { Component, OnInit } from '@angular/core';
import {Observable, BehaviorSubject, throwError, of} from 'rxjs';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';

import { AuthenticationService } from './_services/authentication.service';
import { MicroBlogService } from './_services/micro-blog.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';
  token : string;
  constructor(private router: Router,private authenticationService:AuthenticationService,private microblogservice: MicroBlogService){
    this.token = localStorage.getItem('id_token');
  }

  ngOnInit(){
    
  }

  public get loggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  redirect_to_profile()
  {
    const currentUser = (JSON.parse(localStorage.getItem('currentUser')));
    this.router.navigate(['/profile',currentUser.username]);
  }
}
