import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, ParamMap } from '@angular/router';

import { User, Post, PostArray } from '../user.model';
import { MicroBlogService } from '../micro-blog.service';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  errorMsg :string = '';
  profile_username : string;
  current_user: User = new User();
  current_user_posts: PostArray = new PostArray();
  isprevious_present = "enabled";
  isnext_present = "enabled";
  current_page = 1;

  constructor(private route:ActivatedRoute,private router: Router, private microblogservice:MicroBlogService) { }

  ngOnInit(): void {
    //let username = parseInt(this.route.snapshot.paramMap.get('username'));
    
    this.route.paramMap.subscribe((params : ParamMap) => {
      let username = params.get('username');
      console.log(username);
      this.profile_username = username;
    })
    const current_token = JSON.parse(sessionStorage.getItem('user_token'));
    this.microblogservice.current_user.current_token = current_token;
    
    //const currentUser = this.microblogservice.currentUserValue;
    //const currentUser_posts = this.microblogservice.currentUser_postsValue;
    this.get_currentuser_from_api();

    console.log(this.current_user);
    if(this.profile_username == this.current_user.username)
    {
      this.get_currentuser_post_from_api(this.current_page);
    }
    else
    {
      console.log(this.microblogservice.current_user.current_token);
      this.get_other_user_from_api();
      this.get_other_user_post_from_api(this.current_page);
    }
    
    console.log(this.current_user);
    console.log(this.current_user_posts);
    this.check_previous_next();
    /*
    if(currentUser != null)
    {
      this.current_user = currentUser;
      this.microblogservice.isloggedIn = true;
    }
    else
    {
      this.get_user_from_api();
    }
    if(currentUser_posts != null)
    {
      this.current_user_posts = currentUser_posts;
      this.check_previous_next();
    }
    else
    {
      this.get_post_from_api(this.current_page);
    }*/

    
  }

  public get_currentuser_from_api(){
    this.microblogservice
            .getUser(this.microblogservice.current_user.current_token)
            .subscribe((res: User) => {
              this.current_user = res;
              console.log(this.current_user);
              this.check_previous_next();
            },
          );
  }

  public get_currentuser_post_from_api(pageno : number){
    this.microblogservice
            .getPost(this.microblogservice.current_user.current_token,pageno)
            .subscribe((res: PostArray) => {
              this.current_user_posts = res;
              console.log(this.current_user_posts);
              this.check_previous_next();
            },
          );
  }

  public get_other_user_from_api(){
    this.microblogservice
            .getotherUser(this.microblogservice.current_user.current_token,this.profile_username)
            .subscribe((res: User) => {
              this.current_user = res;
              console.log(this.current_user);
              this.check_previous_next();
            },
          );
  }

  public get_other_user_post_from_api(pageno : number){
    this.microblogservice
            .getotherUserPost(this.microblogservice.current_user.current_token,pageno,this.profile_username)
            .subscribe((res: PostArray) => {
              this.current_user_posts = res;
              console.log(this.current_user_posts);
              this.check_previous_next();
            },
          );
  }

  public getPrevious(){
    alert("previous clicked");
    var pageno = this.current_page - 1;
    if(this.profile_username == this.current_user.username)
    {
      this.get_currentuser_post_from_api(pageno);
      this.current_page = this.current_page - 1;
    }
    else
    {
      this.get_other_user_post_from_api(pageno);
      this.current_page = this.current_page - 1;
    }
    
  }

  public getNext(){
    alert("next clicked");
    var pageno = this.current_page + 1;
    if(this.profile_username == this.current_user.username)
    {
      this.get_currentuser_post_from_api(pageno);
      this.current_page = this.current_page + 1;
    }
    else
    {
      this.get_other_user_post_from_api(pageno);
      this.current_page = this.current_page + 1;
    }
  }

  check_previous_next(){
    if(this.current_page == 1)
    {
      this.isprevious_present = "disabled";
    }
    else{
      this.isprevious_present = "enabled";
    }
    if(this.current_page == this.current_user_posts._meta.total_pages)
    {
      this.isnext_present = "disabled";
    }
    else{
      this.isnext_present = "enabled";
    }
  }
}
