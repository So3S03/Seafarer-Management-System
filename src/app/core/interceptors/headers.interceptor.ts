import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes("token")) {
    let authToken: string = "";
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
      if (localStorage.getItem("userToken") !== null) {
        authToken = localStorage.getItem("userToken")!
      }
    }
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    req = clonedReq;
  }
  return next(req);
};
