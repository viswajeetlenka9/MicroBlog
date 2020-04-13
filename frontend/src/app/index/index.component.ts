import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';

import { User, PostArray } from '../_models/user.model';
import { AuthenticationService } from '../_services/authentication.service'
import { MicroBlogService } from '../_services/micro-blog.service';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  current_username : string;
  errorMsg :string = '';
  current_user: User = new User();
  current_user_posts: PostArray = new PostArray();
  
  postForm : FormGroup;
  
  isprevious_present = "enabled";
  isnext_present = "enabled";
  current_page = 1;
  constructor(private fb: FormBuilder,private route: ActivatedRoute,
    private router: Router, private microblogservice:MicroBlogService,private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.postForm = new FormGroup({
      post: new FormControl('',Validators.required),
    })
    const currentUser = (JSON.parse(localStorage.getItem('currentUser')));

    if(currentUser != null){
      this.current_username = currentUser.username;
    }
    else{
      this.current_username = this.authenticationService.username;
    }


    this.get_user_from_api(this.current_username);
    this.get_post_from_api(this.current_username,this.current_page);
  }

  postFormClick(){
    if(this.postForm.invalid)
    {
      this.errorMsg = "Post field invalid";
    }
    else
    {
      let val = this.postForm.value;
      this.microblogservice
      .submitPost(this.current_user.id,val.post)
      .subscribe((res : any) =>{
        console.log(res);
        this.errorMsg = "Your post is now live";
        this.postForm.reset();
        this.get_post_from_api(this.current_user.username,this.current_page);
        
      })
    }
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
      this.get_post_from_api(this.current_user.username,pageno);
      this.current_page = this.current_page - 1;
      this.check_previous_next();
    }

    public getNext(){
      var pageno = this.current_page + 1;
      this.get_post_from_api(this.current_user.username,pageno);
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
      if(this.current_user_posts != undefined){
        if(this.current_page == this.current_user_posts._meta.total_pages)
        {
          this.isnext_present = "disabled";
        }
        else{
          this.isnext_present = "enabled";
        }
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
