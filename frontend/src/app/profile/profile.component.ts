import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, ParamMap } from '@angular/router';

import { User, PostArray } from '../_models/user.model';
import { MicroBlogService } from '../_services/micro-blog.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  errorMsg :string = '';
  current_username : string;
  profile_username : string;
  current_user: User = new User();
  iscurrent_user : boolean = true;
  current_user_posts: PostArray = new PostArray();
  isprevious_present = "enabled";
  isnext_present = "enabled";
  current_page = 1;

  constructor(private route:ActivatedRoute,private router: Router, private microblogservice:MicroBlogService) { }

  ngOnInit(): void {
    
    this.route.paramMap.subscribe((params : ParamMap) => {
      let username = params.get('username');
      this.profile_username = username;
    })
    
    const currentUser = (JSON.parse(localStorage.getItem('currentUser')));
    this.current_username = currentUser.username;

    if(this.profile_username == this.current_username)
    {
      this.iscurrent_user = true;
    }
    else
    {
      this.iscurrent_user = false;
    }
    this.get_user_from_api(this.profile_username);
    this.get_post_from_api(this.profile_username,this.current_page);
  }
  
  public get_user_from_api(username: string){
    this.microblogservice
            .getUser(username)
            .subscribe((res: User) => {
              this.current_user = res;
              this.microblogservice.isloggedIn = true;
              this.check_previous_next();
            },
          );
  }

  public get_post_from_api(username: string,pageno : number){
    this.microblogservice
            .getPost(username,pageno)
            .subscribe((res: PostArray) => {
              this.current_user_posts = res;
              this.check_previous_next();
            },
          );
  }

  public getPrevious(){
    var pageno = this.current_page - 1;
    this.get_post_from_api(this.profile_username,pageno);
    this.current_page = this.current_page - 1;
    this.check_previous_next();
  }

  public getNext(){
    var pageno = this.current_page + 1;
    this.get_post_from_api(this.profile_username,pageno);
    this.current_page = this.current_page + 1;
    this.check_previous_next();
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
