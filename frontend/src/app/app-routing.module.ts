import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: '/index',
    pathMatch: 'full'
    //component: IndexComponent
  },
  {
    path: "index",
    component: IndexComponent
  },
  {
    path: "login",
    component: LoginComponent
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
