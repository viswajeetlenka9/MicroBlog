import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, Validators, RequiredValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { MicroBlogService } from '../_services/micro-blog.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  errorMsg :string = '';
  resetpasswordForm : FormGroup;

  constructor(private formBuilder: FormBuilder,private router:Router, private microblogservice: MicroBlogService) { }

  ngOnInit(): void {
    this.resetpasswordForm = this.formBuilder.group({
      email: ['', Validators.required]
    })
  }

  resetpasswordInClick(){
    alert('resetpasswordInClick clicked');
  }

}
