import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { CategoriesService } from 'src/app/dashboard/categories/services/categories.service';
import { PricesService } from 'src/app/dashboard/prices/services/prices.service';

import { apiURL } from '../../dashboard/variables/variables'




@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {

  refreshRunners$  = new BehaviorSubject<boolean>(false)

  

  constructor(
    private http: HttpClient,
    private categories: CategoriesService,
    private prices: PricesService,

    ) { }
  
    
  url: string = apiURL+'/mercadopago/create-preference';
  notification: string = apiURL+'/mercadopago/notification'
  runnerUrl: string = apiURL+'/runners';
  walkUrl: string = apiURL+'/mercadopago/walk'

  getRunners():Observable<any> {
    return this.http.get(this.runnerUrl)
  }

  createRunner(runner: any): Observable<any> {
    this.refreshRunners$.next(true)
    return this.http.post(this.runnerUrl, runner)
  }

  async updateRunner(id: string, runner: any): Promise<Observable<any>> {
    const _url: string =  `${this.runnerUrl}/${id}`
    return this.http.put(_url, runner)
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

  sendWalkConfirmationEmail(email: string, name: string, runnerNumber: string, id_number?: string) {
    const data = {
      "email": email,
      "runnerNumber": runnerNumber,
      "name": name,
      "id_nbr": id_number || null
    }
    return this.http.post(this.walkUrl, data)
  }

  createMerchantNotification(moID:string): Observable<any> {    
    const body: any =  {
      resource: 'https://api.mercadolibre.com/merchant_orders/'+moID,
      topic: 'merchant_order'
    }
    return this.http.post(this.notification, body)
  }


}
