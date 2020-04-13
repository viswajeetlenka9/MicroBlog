import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ProfileComponent } from './profile/profile.component';
import { ExploreComponent } from './explore/explore.component';
import { EditprofileComponent } from './editprofile/editprofile.component';

import { MicroBlogService } from './_services/micro-blog.service';

import { AuthInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';

//import { ErrorInterceptor } from './_helpers/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    PageNotFoundComponent,
    RegisterComponent,
    ResetpasswordComponent,
    ProfileComponent,
    ExploreComponent,
    EditprofileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    HttpClientModule
  ],
  providers: [
    MicroBlogService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
