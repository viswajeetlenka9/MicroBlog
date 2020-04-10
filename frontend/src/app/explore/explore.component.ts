import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { User, Post, PostArray } from '../user.model';
import { MicroBlogService } from '../micro-blog.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  errorMsg :string = '';
  username : string = '';
  all_users_posts : PostArray = new PostArray();
  isprevious_present = "enabled";
  isnext_present = "enabled";
  current_page = 1;

  constructor(private router: Router, private microblogservice:MicroBlogService) { }

  ngOnInit(): void {
    const currentUser = this.microblogservice.currentUserValue;
    const allUser_posts = this.microblogservice.allUser_postsValue;

    if((this.microblogservice.token == undefined && allUser_posts == null) || this.microblogservice.token == '')
    {
      this.microblogservice.errorMsg = "Please login to access this page";
      this.microblogservice.logout();
    }
    else
    {
      if(allUser_posts != null)
      {
        this.username = currentUser.username;
        this.all_users_posts = allUser_posts;
        this.check_previous_next();
      }
      else
      {
        this.username = this.microblogservice.username;
        console.log(this.username);
        this.get_allpost_from_api(this.current_page);
      }
      
    }
  }

  public get_allpost_from_api(pageno : number){
    console.log(pageno);
    this.microblogservice
            .getallPosts(this.microblogservice.token,pageno)
            .subscribe((res: any) => {
              this.all_users_posts = res;
              this.check_previous_next();
              //console.log(moment(this.current_user_posts[0].timestamp).fromNow());
            },
          );
  }

  getPrevious(){
    let pageno = this.current_page - 1;
    this.microblogservice
            .getallPosts(this.microblogservice.token,pageno)
            .subscribe((res: any) => {
              this.all_users_posts = res;
              this.current_page  = this.current_page - 1;
              this.check_previous_next();
              
              //console.log(moment(this.current_user_posts[0].timestamp).fromNow());
            },
          );
  }

  getNext(){
    let pageno = this.current_page + 1;
    this.microblogservice
            .getallPosts(this.microblogservice.token,pageno)
            .subscribe((res: any) => {
              this.all_users_posts = res;
              this.current_page  = this.current_page + 1;
              this.check_previous_next();
              
              //console.log(moment(this.current_user_posts[0].timestamp).fromNow());
            },
          );
  }

  check_previous_next(){
    if(this.current_page == 1)
    {
      this.isprevious_present = "disabled";
    }
    else{
      this.isprevious_present = "enabled";
    }
    if(this.current_page == this.all_users_posts._meta.total_pages)
    {
      this.isnext_present = "disabled";
    }
    else{
      this.isnext_present = "enabled";
    }
  }
  /*
  sort_by_desc( users_posts : Post[])
  {
    return users_posts.sort((a,b) => {
      return (<number>(b.id) - <number>(a.id));
    });
  }
  */
}
