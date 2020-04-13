import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PostArray } from '../_models/user.model';
import { MicroBlogService } from '../_services/micro-blog.service';

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
    
    const currentUser = (JSON.parse(localStorage.getItem('currentUser')));
    this.username = currentUser.username;

    this.get_allpost_from_api(this.current_page);

  }

  public get_allpost_from_api(pageno : number){
    console.log(pageno);
    this.microblogservice
            .getallPosts(pageno)
            .subscribe((res: any) => {
              this.all_users_posts = res;
              this.check_previous_next();
              //console.log(moment(this.current_user_posts[0].timestamp).fromNow());
            },
          );
  }

  getPrevious(){
    let pageno = this.current_page - 1;
    this.get_allpost_from_api(pageno);
    this.current_page  = this.current_page - 1;
    this.check_previous_next();
  }

  getNext(){
    let pageno = this.current_page + 1;
    this.get_allpost_from_api(pageno);
    this.current_page  = this.current_page + 1;
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
