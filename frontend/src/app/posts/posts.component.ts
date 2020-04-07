import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { User, Post } from '../user.model';
import { MicroBlogService } from '../micro-blog.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  current_user_posts:any;
  current_user_posts_temp : Post[];
  verify_user: Subscription;
  /*posts = [
    {
        'author': {'username': 'John'},
        'body': 'Beautiful day in Portland!',
        'id' : 1,
        'language':null,
        'timestamp':'Wed, 18 Mar 2020 19:11:35 GMT',
        'user_id': 1
    },
    {
        'author': {'username': 'Susan'},
        'body': 'The Avengers movie was so cool!',
        'id' : 2,
        'language':null,
        'timestamp':'Wed, 18 Mar 2020 19:11:51 GMT',
        'user_id': 2
    },
    {
      'author': {'username': 'vicky'},
      'body': 'Have a nice day!',
      'id' : 3,
      'language':null,
      'timestamp':'Sun, 22 Mar 2020 09:01:10 GMT',
      'user_id': 3
    }
    ]*/
  constructor(private microblogservice:MicroBlogService) { }

  ngOnInit(): void {
    const currentUser_posts = this.microblogservice.currentUser_postsValue;
    /*this.current_user_posts = this.posts.sort((a,b) => {
      return <number>(b.id) - <number>(a.id);
    });*/
    //let now = moment(this.posts[0].timestamp).fromNow();
    //console.log(now);
    console.log(this.current_user_posts);
    if((this.microblogservice.token == undefined && currentUser_posts == null) || this.microblogservice.token == '')
    {
      //Do nothing index handles it
    }
    else
    {
      if(currentUser_posts != null)
      {
        console.log(currentUser_posts);
        this.current_user_posts = this.sort_by_desc(currentUser_posts);
      }
      else
      {
          this.verify_user = this.microblogservice
            .getPost(this.microblogservice.token)
            .subscribe((res: any) => {
              this.current_user_posts_temp = res;
              this.current_user_posts = this.sort_by_desc(this.current_user_posts_temp);
              console.log(this.current_user_posts);
              //console.log(moment(this.current_user_posts[0].timestamp).fromNow());
            },
          );
      }
    }
    
  }

  sort_by_desc( current_user_posts_temp : Post[])
  {
    return current_user_posts_temp.sort((a,b) => {
      return (<number>(b.id) - <number>(a.id));
    });
  }

}
