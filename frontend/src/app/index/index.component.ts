import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { User, Post } from '../user.model';
import { MicroBlogService } from '../micro-blog.service';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  //username: string;
  current_user: User = new User();
  verify_user: Subscription;

  user = {'username': 'Viswajeet'}
  posts = [
      {
          'author': {'username': 'John'},
          'body': 'Beautiful day in Portland!'
      },
      {
          'author': {'username': 'Susan'},
          'body': 'The Avengers movie was so cool!'
      }
  ]
  constructor(private route: ActivatedRoute,
    private router: Router, private microblogservice:MicroBlogService) { }

  ngOnInit(): void {
    const currentUser = this.microblogservice.currentUserValue;
    
    if((this.microblogservice.token == undefined && currentUser == null) || this.microblogservice.token == '')
    {
      alert('You need to login first!');
      this.router.navigate(['/login']);
    }
    else
    {
      if(currentUser != null)
      {
        this.current_user = currentUser;
      }
      else
      {
          this.verify_user = this.microblogservice
            .getUser(this.microblogservice.token)
            .subscribe((res: any) => {
              console.log(res);
              this.current_user = res;
            },
          );
      }
    }
    
  }

}
