import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, Validators, RequiredValidator } from '@angular/forms';
import { Router,ActivatedRoute, ParamMap } from '@angular/router';

import { User, Post, PostArray } from '../user.model';
import { MicroBlogService } from '../micro-blog.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  errorMsg :string = '';
  current_user: User = new User();
  editProfileForm = new FormGroup({
    username: new FormControl('',Validators.required),
    about_me: new FormControl('',Validators.required),
  })
  constructor(private router: Router, private microblogservice:MicroBlogService) { }

  ngOnInit(): void {
    const current_token = JSON.parse(sessionStorage.getItem('user_token'));
    this.microblogservice.current_user.current_token = current_token;

    const current_username = JSON.parse(sessionStorage.getItem('currentusername'));
    this.microblogservice.current_user.current_username = current_username;

    console.log(this.microblogservice.current_user.current_token);

    this.current_user = this.get_currentuser_from_api();
    //const currentUser = this.microblogservice.currentUserValue;
    //this.current_user = currentUser;
    console.log("after api call"+this.current_user.username);
    this.setValue(this.current_user.username,this.current_user.about_me);
  }

  editProfileFormClick(){
    if(this.editProfileForm.valid)
    {
      this.microblogservice
      .updateUser(this.microblogservice.current_user.current_token,this.editProfileForm.value.username,this.current_user.email,this.editProfileForm.value.about_me,this.current_user.id)
      .subscribe((res: User) => {
        console.log(res);
        this.errorMsg = "Your details are updated!";
        this.setValue(res.username,res.about_me);
      },
      error => this.errorMsg = error.message);
    }
    else{
      this.errorMsg = "Form is Invalid";
    }
  }

  public get_currentuser_from_api() : User{
    this.microblogservice
            .getUser(this.microblogservice.current_user.current_token)
            .subscribe((res: User) => {
              this.current_user = res;
              console.log("at api call : "+this.current_user.username);
              
            },
          );
    return(this.current_user);
  }

  setValue(username : string,about_me : string) { 
    this.editProfileForm.setValue({username: username, about_me: about_me}); 
  }
}
