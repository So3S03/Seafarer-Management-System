import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly BaseUrl: string = environment.APIsBaseUrl;
  private readonly httpClient: HttpClient = inject(HttpClient);

  getToken(data: string): Observable<any>
  {
    return this.httpClient.post(`${this.BaseUrl}token`, data)
  }
}
