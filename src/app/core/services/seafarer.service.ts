import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { IEmployee } from '../interfaces/iemployee';
import { IVendor } from '../interfaces/ivendor';

@Injectable({
  providedIn: 'root'
})
export class SeafarerService {
  private readonly _HttpClient :HttpClient = inject(HttpClient);
  private readonly BaseUrl: string = environment.APIsBaseUrl;
  AllEmps!: IEmployee[];
  AllVendors!: IVendor[];

  getAllSeafarers(currentPage: number = 1, pageSize: number = 1000): Observable<any>
  {
    return this._HttpClient.get(`${this.BaseUrl}api/MarineServices/GetAllSeafarers?Direction=ltr&Index=${currentPage}&PageSize=${pageSize}`)
  }

  addNewSeafarer(SeafarerData: any): Observable<any>
  {
    return this._HttpClient.post(`${this.BaseUrl}api/MarineServices/SaveSeafarer`, SeafarerData);
  }

  getEmployees(): Observable<any>
  {
    return this._HttpClient.get(`${this.BaseUrl}api/POS/FillEmployee?Id=0&text=&Direction=ltr&InCT`)
  }

  getVendors(): Observable<any>
  {
    return this._HttpClient.get(`${this.BaseUrl}api/LegalAffairs/FillVendor?Id=0&text=&Direction=ltr&InCT`)
  }

  subscripEmpsAndVendors()
  {
    this.getEmployees().subscribe({
      next: res => this.AllEmps = res,
      error: err => console.log(err)
    })

    this.getVendors().subscribe({
      next: res => this.AllVendors = res,
      error: err => console.log(err)
    })
  }

  seafarerStatus(activeInActiveStatus: number, seafarerId: number): Observable<any>
  {
    return this._HttpClient.post(`${this.BaseUrl}api/MarineServices/ActivateAndInActivateSeafarer?Id=${seafarerId}&Status=${activeInActiveStatus}&EmpId=1`, "")
  }
}
