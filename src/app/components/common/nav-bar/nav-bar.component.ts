import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  private readonly _PLATFORM_ID  = inject(PLATFORM_ID);
  private readonly _Router: Router = inject(Router);
  logOut(): void
  {
    if(isPlatformBrowser(this._PLATFORM_ID))
    {
      localStorage.removeItem("userToken");
      this._Router.navigate(["/Login"]);
    }
  }
}
