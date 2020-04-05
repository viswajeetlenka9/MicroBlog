import { Injectable } from '@angular/core';
import { HttpEvent,HttpHandler,HttpRequest,HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError,retry } from 'rxjs/operators';

import { MicroBlogService } from '../micro-blog.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private microBlogService: MicroBlogService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(retry(1),catchError(err => {
            let errorMessage = '';
            if (err.error instanceof ErrorEvent) {
                // client-side error
                errorMessage = `Error: ${err.error.message}`;
            } else {
                if (err.status === 401) {
                    // auto logout if 401 response returned from api
                    //location.reload(true);
                    errorMessage = "Username and Password is incorrect!";
                }
                // server-side error
                errorMessage = `Error Status: ${err.status}\nMessage: ${err.message}`;
            }
            //const error = err.error.message || err.statusText;
            console.log(errorMessage);
            return throwError(errorMessage);
        }))
    }
}