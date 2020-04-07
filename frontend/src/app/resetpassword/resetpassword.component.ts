import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, Validators, RequiredValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { MicroBlogService } from '../micro-blog.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  errorMsg :string = '';
  resetpasswordForm = new FormGroup({
    email: new FormControl('',Validators.required),
  })
  constructor(private fb: FormBuilder,private router:Router, private microblogservice: MicroBlogService) { }

  ngOnInit(): void {
  }

  resetpasswordInClick(){
    alert('resetpasswordInClick clicked');
  }

}
