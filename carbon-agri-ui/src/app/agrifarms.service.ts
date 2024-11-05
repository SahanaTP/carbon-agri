import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agrifarms } from './agrifarms';

@Injectable({
  providedIn: 'root'
})
export class AgrifarmsService {

  constructor(private _httpClient:HttpClient) { }

  baseUrl:String="/api/carbon_data";
  fetchAllDataForAFarm(date: string, farm: string):Observable<Agrifarms[]>{
    const params = new HttpParams()
    .set('date', date)  // Set the 'date' query parameter
    .set('farm', farm); // Set the 'farm' query parameter

    return this._httpClient.get<Agrifarms[]>(`${this.baseUrl}`, { params });
  }
}
