import { Component, OnInit, Renderer2 } from '@angular/core';
import { PaymentServiceService } from '../services/payment-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class PaymentHomeComponent implements OnInit {
  r: string
  runner: any
  paymentData   : any
  categories    : any[]
  prices        : any[]
  discounts     : any[]

  constructor(
    private paymentService: PaymentServiceService, 
    private router: Router, 
    private renderer: Renderer2
    ){}

  ngOnInit(): void {
    this.r = localStorage.getItem('runner')

    this.paymentService.getAllPrices().subscribe({
      next: (data) =>  this.prices = data,
      error: (e) =>  console.error(e),
      complete: () => {
        console.log(this.prices);
      }
    })

    this.paymentService.getAllDiscounts().subscribe({
      next: (data) =>  this.discounts = data,
      error: (e) =>  console.error(e),
      complete: () => {
        console.log(this.discounts);
      }
    })
    
    
    this.runner = JSON.parse(this.r)
    this.paymentData =  {
      category_id: '1',
      currency_id: 'ARS',
      description: this.runner.circuito,
      title: 'Inscripcion MMRun V2',
      quantity: 1,
      unit_price: 7200.00
    }
    
  }

  

  createPayment(){
    this.paymentService.createPreference(this.paymentData).subscribe(
      data => {
        this.navigateToUrl(data.body.init_point)
      },

      error => {
        console.log(error);
        
      }
    )
  }

  navigateToUrl(url: string) {
    window.location.href = url
  }

}
