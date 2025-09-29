import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authorizedGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const _Platform_ID = inject(PLATFORM_ID);
  if (isPlatformBrowser(_Platform_ID)) {
    const authToken = localStorage.getItem("userToken");
    if (authToken) {
      _Router.navigate(["/Home"]);
      return false;
    }
  }
  return true;
};
