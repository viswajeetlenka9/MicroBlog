import { Component, OnInit, Input, OnDestroy} from '@angular/core';
import { FormBuilder,FormGroup, FormControl, Validators, RequiredValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { IndexComponent } from '../index/index.component';
import { MicroBlogService } from '../micro-blog.service';
import { Subscription, Subject } from 'rxjs';
import { User } from '../user.model'
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  isloggedIn : boolean;
  errorMsg :string = '';
  token : string = '';
  current_user : User;
  verify_user: Subscription;
  myForm : FormGroup;
  loginForm = new FormGroup({
    username: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
    remembermeCheck: new FormControl('')
  })
  destroy$: Subject<boolean> = new Subject<boolean>();

  //@Input() username : IndexComponent;
  constructor(private fb: FormBuilder,private router:Router, private microblogservice: MicroBlogService ) { }

  ngOnInit(): void {
    this.isloggedIn = this.microblogservice.isloggedIn;
    if(this.isloggedIn)
    {
      this.microblogservice.logout();
    }
    this.errorMsg = this.microblogservice.errorMsg;
    
  }
  /*
  ngOnDestroy(){
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
  */
  
  signInClick(){
      if(this.loginForm.value.remembermeCheck == true)
      {
        alert('remember me checked');
      }
      this.verify_user = this.microblogservice
      .getToken(this.loginForm.value.username,this.loginForm.value.password)
      .subscribe((res: any) => {
        this.token = res.token;
        this.microblogservice.current_user.current_token = this.token;
        console.log(this.token);
        this.router.navigate(['/index']);        
      },
      error => this.errorMsg = error);
  }
}
