import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private route:ActivatedRoute) { }

  ngOnInit(): void {
    //let username = parseInt(this.route.snapshot.paramMap.get('username'));
    this.route.paramMap.subscribe((params : ParamMap) => {
      let username = parseInt(params.get('username'));
      console.log(username);
    })
    
  }

}
