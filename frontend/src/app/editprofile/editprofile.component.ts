import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, Validators, RequiredValidator } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../_models/user.model';
import { MicroBlogService } from '../_services/micro-blog.service';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent implements OnInit {

  errorMsg :string = '';
  current_user: User = new User();
  editProfileForm = new FormGroup({
    username: new FormControl('',Validators.required),
    about_me: new FormControl('',Validators.required),
  })
  constructor(private router: Router, private microblogservice:MicroBlogService) { }

  ngOnInit(): void {

    const currentUser = (JSON.parse(localStorage.getItem('currentUser')));
    this.current_user = currentUser;

    this.get_user_from_api(this.current_user.username);

    this.setValue(this.current_user.username,this.current_user.about_me);
  }

  editProfileFormClick(){
    if(this.editProfileForm.valid)
    {
      let val = this.editProfileForm.value;
      this.microblogservice
      .updateUser(val.username,this.current_user.email,val.about_me,this.current_user.id)
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

  public get_user_from_api(username: string){
    this.microblogservice
            .getUser(username)
            .subscribe((res: User) => {
              this.current_user = res;
            },
          );
  }

  setValue(username : string,about_me : string) { 
    this.editProfileForm.setValue({username: username, about_me: about_me}); 
  }

}
