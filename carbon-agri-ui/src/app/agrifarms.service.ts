import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agrifarms } from './agrifarms';
import { Groundfarms } from './groundfarms';

@Injectable({
  providedIn: 'root'
})
export class AgrifarmsService {

  constructor(private _httpClient:HttpClient) { }

  baseUrl="http://localhost:3000/api/carbon_data";
  fetchAllDataForAFarm(farm: string, date?: string):Observable<Agrifarms[]>{
    let params = new HttpParams()
    .set('farm', farm); // Set the 'farm' query parameter
    if (date) {
      params = params.set('date', date); // Set 'date' only if it's provided
    }

    return this._httpClient.get<Agrifarms[]>(`${this.baseUrl}`, { params });
  }

  groundUrl="http://localhost:3000/api/ground_data";
  fetchAllDataForAGroundFarm(farm: string, date?: string):Observable<Groundfarms[]>{
    let params = new HttpParams()
    .set('farm', farm); // Set the 'farm' query parameter
    if (date) {
      params = params.set('date', date); // Set 'date' only if it's provided
    }

    return this._httpClient.get<Groundfarms[]>(`${this.groundUrl}`, { params });
  }
}
