import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, Validators, RequiredValidator } from '@angular/forms';
import { Router } from '@angular/router';

import { MustMatch } from '../_validators/must-match.validators';
import { MicroBlogService } from '../_services/micro-blog.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  errorMsg :string = '';
  registerForm : FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,private router:Router, private microblogservice: MicroBlogService) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmpassword')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  registerInClick(){
    this.submitted = true;

    if(this.registerForm.invalid)
    {
      this.errorMsg = "Form is invalid. Please fill in the details correctly";
      return;
    }
    let val = this.registerForm.value;
    this.microblogservice
    .registerUser(val.username,val.email,val.password1)
    .subscribe((res: any) => {
      this.errorMsg = "Congratulations, you are now a registered user!";
      setTimeout(() => {
        this.router.navigate(['/login']);
      }
      , 5000);       
    },
    error => this.errorMsg = error.error.message);
  }

}
