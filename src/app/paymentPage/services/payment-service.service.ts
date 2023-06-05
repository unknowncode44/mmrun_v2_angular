import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {

  constructor(private http: HttpClient) { }

  apiURL: string = 'http://localhost:3040/mercadopago/create-preference'


  createPreference(itemData: any): Observable<any> {
    return this.http.post(this.apiURL, itemData)
  }
}
