import { Component, OnInit } from '@angular/core';
import { MicroBlogService } from './micro-blog.service';
import {Observable, BehaviorSubject, throwError, of} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';

  constructor(private microblogservice: MicroBlogService){
    
  }

  ngOnInit(){
    if(localStorage.getItem('currentUser') != null)
    {
      this.microblogservice.isloggedIn = true;
    }
    else{
      this.microblogservice.isloggedIn = false;
    }
  }

  public get loggedIn(): boolean {
    console.log(this.microblogservice.isloggedIn);
    return this.microblogservice.isloggedIn;
  }

}
