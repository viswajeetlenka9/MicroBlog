import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { first } from 'rxjs/operators'

import { AuthenticationService } from '../_services/authentication.service';

import { User } from '../_models/user.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{


  isloggedIn : boolean;
  errorMsg :string = '';
  loading = false;
  submitted = false;
  returnUrl: string;
  token : string = '';
  current_user : User;
  loginForm : FormGroup;
  
  //destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private formBuilder: FormBuilder,private router:Router,private route:ActivatedRoute, private authenticationService: AuthenticationService ) { }

  ngOnInit(): void {
    // reset login status
    this.authenticationService.logout();

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remembermeCheck: [false]
    })

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  /*
  ngOnDestroy(){
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
  */
  
  signInClick(){
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
        this.errorMsg = "Invalid Form. Please check!";
        return;
      }

      this.loading = true;
      if(this.loginForm.value.remembermeCheck == true)
      {
        alert('remember me checked');
      }
      let val = this.loginForm.value;
      this.authenticationService
      .get_token_from_api(val.username,val.password)
      .pipe(first())
      .subscribe(data => {
        this.router.navigate([this.returnUrl]);    
      },
      error => {
        this.errorMsg = error;
        this.loading = false;
      });
  }
}
