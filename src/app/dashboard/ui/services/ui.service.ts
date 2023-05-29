import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  uiUrl: string = 'http://31.187.76.251:3040/ui'

  constructor(public http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(this.uiUrl)
  }

  updateOne(id: string, body: any): Observable<any> {
    let url = `${this.uiUrl}/${id}`
    return this.http.put(url, body)
  }

}
