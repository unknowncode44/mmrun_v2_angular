import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL } from '../../variables/variables';

@Injectable({
  providedIn: 'root'
})
export class UiService {


  uiUrl: string = apiURL+'/ui'

  constructor(public http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(this.uiUrl)
  }

  updateOne(id: string, body: any): Observable<any> {
    let url = `${this.uiUrl}/${id}`
    return this.http.put(url, body)
  }

}
