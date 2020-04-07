import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, Validators, RequiredValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { MicroBlogService } from '../micro-blog.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formValid : boolean = true;
  errorMsg :string = '';
  registerForm = new FormGroup({
    username: new FormControl('',Validators.required),
    email: new FormControl('',Validators.required),
    password1: new FormControl('',Validators.required),
    password2: new FormControl('',Validators.required),
  })

  constructor(private fb: FormBuilder,private router:Router, private microblogservice: MicroBlogService) { }

  ngOnInit(): void {
  }

  registerInClick(){
    if(this.registerForm.value.password1 != this.registerForm.value.password2)
    {
      this.errorMsg = "Both password should be same!";
      this.formValid = false;
    }
    else
    {
      this.formValid = true;
    }
    if(this.registerForm.value.username == '' || this.registerForm.value.email == '' || this.registerForm.value.password1 == '' || this.registerForm.value.password2 == '')
    {
      this.errorMsg = "Field cannot be empty!";
      this.formValid = false;
    }
    else
    {

      this.formValid = true;
    }

    if(this.formValid)
    {
      this.microblogservice
      .registerUser(this.registerForm.value.username,this.registerForm.value.email,this.registerForm.value.password1)
      .subscribe((res: any) => {
        console.log(res);
        this.microblogservice.errorMsg = "Congratulations, you are now a registered user!";
        this.router.navigate(['/login']);        
      },
      error => this.errorMsg = error.error.message);
    }
  }

}
