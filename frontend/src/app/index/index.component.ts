import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder,FormGroup, FormControl, Validators, RequiredValidator } from '@angular/forms';

import { User, Post, PostArray } from '../user.model';
import { MicroBlogService } from '../micro-blog.service';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  errorMsg :string = '';
  current_user: User = new User();
  current_user_posts: PostArray = new PostArray();
  verify_user: Subscription;
  postForm = new FormGroup({
    post: new FormControl('',Validators.required),
  })
  isprevious_present = "enabled";
  isnext_present = "enabled";
  current_page = 1;
  constructor(private fb: FormBuilder,private route: ActivatedRoute,
    private router: Router, private microblogservice:MicroBlogService) { }

  ngOnInit(): void {
    

    //const currentUser = this.microblogservice.currentUserValue;
    //const currentUser_posts = this.microblogservice.currentUser_postsValue;

    if((this.microblogservice.current_user == undefined) || this.microblogservice.currentuser_token == '')
    {
      this.microblogservice.errorMsg = "Please login to access this page";
      this.microblogservice.logout();
    }
    else
    {
      this.get_user_from_api();
      this.get_post_from_api(this.current_page);
    }
  }

  postFormClick(){
    if(this.postForm.value.post == '')
    {
      this.errorMsg = "Cannot submit empty post";
    }
    else
    {
      this.microblogservice
      .submitPost(this.current_user.id,this.postForm.value.post)
      .subscribe((res : any) =>{
        console.log(res);
        this.errorMsg = "Your post is now live";
        this.postForm.reset();
        this.get_post_from_api(this.current_page);
        
      })
    }
  }

  public get_user_from_api(){
    this.verify_user = this.microblogservice
            .getUser(this.microblogservice.current_user.current_token)
            .subscribe((res: User) => {
              this.current_user = res;
              console.log(this.current_user);
              this.microblogservice.isloggedIn = true;
              this.check_previous_next();
            },
          );
  }

  public get_post_from_api(pageno : number){
    this.verify_user = this.microblogservice
            .getPost(this.microblogservice.current_user.current_token,pageno)
            .subscribe((res: PostArray) => {
              this.current_user_posts = res;
              console.log(this.current_user_posts);
              this.check_previous_next();
            },
          );
  }

    public getPrevious(){
      var pageno = this.current_page - 1;
      this.microblogservice
              .getPost(this.microblogservice.current_user.current_token,pageno)
              .subscribe((res: PostArray) => {
                this.current_user_posts = res;
                //this.current_user_posts = this.sort_by_desc(this.current_user_posts);
                this.current_page = this.current_page - 1;
                this.check_previous_next();
                console.log(this.current_user_posts);
                //console.log(moment(this.current_user_posts[0].timestamp).fromNow());
              },
            );
    }

    public getNext(){
      var pageno = this.current_page + 1;
      this.microblogservice
              .getPost(this.microblogservice.current_user.current_token,pageno)
              .subscribe((res: PostArray) => {
                this.current_user_posts = res;
                //this.current_user_posts = this.sort_by_desc(this.current_user_posts);
                this.current_page = this.current_page + 1;
                this.check_previous_next();
                console.log(this.current_user_posts);
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
      if(this.current_page == this.current_user_posts._meta.total_pages)
      {
        this.isnext_present = "disabled";
      }
      else{
        this.isnext_present = "enabled";
      }
    }
  
    /*
    sort_by_desc( current_user_posts_temp : Post[])
    {
      return current_user_posts_temp.sort((a,b) => {
        return (<number>(b.id) - <number>(a.id));
      });
    }
    */
  

}
