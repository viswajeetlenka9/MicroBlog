import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { User, Post } from '../user.model';
import { MicroBlogService } from '../micro-blog.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  //current_username: string = "";
  current_user_posts:any;
  verify_user: Subscription;
  constructor(private microblogservice:MicroBlogService) { }

  ngOnInit(): void {
    const currentUser_posts = this.microblogservice.currentUser_postsValue;
    //this.current_username = this.microblogservice.username;
    if(currentUser_posts != null)
    {
      console.log(currentUser_posts);
      this.current_user_posts = currentUser_posts;
    }
    else
    {
        this.verify_user = this.microblogservice
          .getPost(this.microblogservice.token)
          .subscribe((res: any) => {
            this.current_user_posts = res.items;
            //this.current_user_posts.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1)
            console.log(this.current_user_posts);
          },
        );
    }
  }

}
