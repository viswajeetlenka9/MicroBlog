import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ProfileComponent } from './profile/profile.component';
import { ExploreComponent } from './explore/explore.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { AuthGuard } from './_guard/auth.guard';
//import { EditProfileComponent } from './edit-profile/edit-profile.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: '/index',
    pathMatch: 'full'
    //component: IndexComponent
  },
  {
    path: "index",
    component: IndexComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "profile/:username",
    component: ProfileComponent
  },
  {
    path: "resetpassword",
    component: ResetpasswordComponent
  },
  {
    path: "explore",
    component: ExploreComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "editprofile",
    component: EditprofileComponent
  },
  {
    path: "**",//The wild card route should be the last route otherwise the routes below wildcard route will be ignored.
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
