import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import { CategoriesService } from 'src/app/dashboard/categories/services/categories.service';
import { PricesService } from 'src/app/dashboard/prices/services/prices.service';

import { apiURL } from '../../dashboard/variables/variables'


@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {

  constructor(
    private http: HttpClient,
    private categories: CategoriesService,
    private prices: PricesService
    ) { }
  
    
  url: string = apiURL+'/mercadopago/create-preference';
  notification: string = apiURL+'/mercadopago/notification'
  runnerUrl: string = apiURL+'/runners';

  getRunners():Observable<any> {
    return this.http.get(this.runnerUrl)
  }

  createRunner(runner: any): Observable<any> {
    return this.http.post(this.runnerUrl, runner)
  }


  createPreference(itemData: any): Observable<any> {
    return this.http.post(this.url, itemData)
  }

  getAllPrices(): Observable<any> {
    return this.prices.getAllPrices()
  }

  getAllDiscounts(): Observable<any> {
    return this.prices.getAllDiscounts()
  }

  createMerchantNotification(moID:string): Observable<any> {    
    const body: any =  {
      resource: 'https://api.mercadolibre.com/merchant_orders/'+moID,
      topic: 'merchant_order'
    }
    return this.http.post(this.notification, body)
  }


}
