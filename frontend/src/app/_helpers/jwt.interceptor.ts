import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError,map } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication.service';
import { MicroBlogService } from '../_services/micro-blog.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private microBlogService: MicroBlogService,private authenticationService:AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const idToken = this.authenticationService.get_auth_token();

        if (idToken) {
            const cloned = request.clone({
                headers: request.headers.set("Authorization",
                    "Bearer " + idToken)
                    .set('Content-Type', 'application/json'),
            });
            return next.handle(cloned);
        }
        else {
            return next.handle(request);
        }
    }
}