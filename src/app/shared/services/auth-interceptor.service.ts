import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private cookieService: CookieService,
    private router: Router
  ) { }

  private get userToken() {
    return this.cookieService.get('token');
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = req;

    // Don't add the Authorization header if the 'No-Auth' header is present
    if (!req.headers.has('No-Auth')) {
      authReq = req.clone({
        // headers: req.headers.set('Authorization', `Bearer ${this.userToken}`),
        headers: req.headers.set('Authorization', `Bearer ${this.userToken}`),
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403 && error.error.error === 'Forbidden. You dont have permission to access this resource') {
          this.router.navigateByUrl('/access-denied');
        }

        if (error.status === 401) {
          this.router.navigateByUrl('/auth');
        }

        return throwError(error);
      })
    );
  }
}
