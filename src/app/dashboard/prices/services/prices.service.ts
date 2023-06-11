import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL     } from '../../variables/variables';

@Injectable({
  providedIn: 'root'
})
export class PricesService {

  baseURl: string =  apiURL 
  categoriesUrl: string = apiURL+'/categories'
  discountsUrl:   string = apiURL+'/discounts'

  constructor(
    private http: HttpClient
    ) { }


  getAllPrices(): Observable<any> {
    return this.http.get(this.categoriesUrl)
  }

  getAllDiscounts(): Observable<any> {
    return this.http.get(this.discountsUrl)
  }

  addOneDiscount(discount: any): Observable<any> {
    return this.http.post(this.discountsUrl, discount)
  }
  
  updatePrice(id: number, category: any): Observable<any> {
    let url = apiURL+'/categories/'+id.toString()
    return this.http.put(url, category)
  }

  updateDiscount(id: number, discount: any): Observable<any> {
    let url = apiURL+'/discounts/'+id.toString()
    return this.http.put(url, discount)
  }

  deleteDiscount(id: number): Observable<any> {
    let url = apiURL+'/discounts/'+id.toString()
    return this.http.delete(url) 
  }

}
