import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { PaymentServiceService } from '../services/payment-service.service';
import { Router } from '@angular/router';

interface PricesSchedule {
  priceConcat: string,
  price: number,
  circuito: string,
}

@Component({
  selector: 'app-payment',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [CurrencyPipe]
})
export class PaymentHomeComponent implements OnInit, OnDestroy {
  r: string
  runner: any
  paymentData   : any
  categories    : any[]
  prices        : any[] = []
  discounts     : any[]
  priceConcat   : any[]

  partnerDiscount : number = 0;
  otherDiscounts  : number = 0;
  circuitCost   : number   = 0;

  partnerDiscountPercentage : number = 0;
  couponDiscountPercentage  : number = 0; 

  circuitCostString : string
  partnertDiscStr   : string
  couponDiscStr     : string

  toPay             : number = 0;
  toPayString       : string
  
  runnerNbrs: number[] = []

  loading: boolean = true

  visible: boolean = false


  constructor(
    private paymentService: PaymentServiceService, 
    private router: Router, 
    private renderer: Renderer2,
    private currencyPipe: CurrencyPipe
    ){}

  ngOnInit(): void {
    this.r = localStorage.getItem('runner')
    this.runner = JSON.parse(this.r)

    this.paymentService.getAllPrices().subscribe({
      next: (data) =>  {
        for (let i = 0; i < data.length; i++) {
          const e = data[i];
          const {precio, title} = e;
          let item = {
            _precio: Number(precio),
            title,
            price_Concat: `${title}, (${precio})`
          }
          this.prices.push(item)
          }
      },
      error: (e) =>  console.error(e),
      complete: () => {
        
        console.log(this.prices);
        
      }
    })

    this.paymentService.getAllDiscounts().subscribe({
      next: (data) =>  this.discounts = data,
      error: (e) =>  console.error(e),
      complete: () => {
        if(this.runner.discount) {
          for (let i = 0; i < this.discounts.length; i++) {
            const e = this.discounts[i];
            if(this.runner.discountCode === e.tipo){
              this.couponDiscountPercentage = e.percentage
              //console.log(`P: ${this.couponDiscountPercentage} ok!`);
            }
          }
        }

        if(this.runner.partner) {
          for (let i = 0; i < this.discounts.length; i++) {
            const e = this.discounts[i];
            if(e.discountName === 'Socios MM') {
              this.partnerDiscountPercentage = e.percentage
              //console.log(`P: ${this.partnerDiscountPercentage} ok!`);
            }
          }

        }

        
        
        this.circuitCost        = Number(this.runner.price)
        this.partnerDiscount    = this.calculatePercentage(this.circuitCost, this.partnerDiscountPercentage )
        this.otherDiscounts     = this.calculatePercentage(this.circuitCost, this.couponDiscountPercentage  )
        this.toPay              = this.circuitCost - this.partnerDiscount - this.otherDiscounts

        this.circuitCostString  = this.currencyPipe.transform(this.circuitCost,     '$ ',)
        this.partnertDiscStr    = this.currencyPipe.transform(this.partnerDiscount, '$ ',)
        this.couponDiscStr      = this.currencyPipe.transform(this.otherDiscounts,  '$ ',)
        this.toPayString        = this.currencyPipe.transform(this.toPay,           '$ ',)

        this.paymentData =  {
          category_id: '1',
          currency_id: 'ARS',
          description: this.runner.circuito,
          title: '',
          quantity: 1,
          unit_price: this.toPay,
        }
        this.loading = false
      }
    })
  }

  ngOnDestroy(): void {
      localStorage.removeItem('runner')
  }

  calculatePercentage(whole: number, percentage: number): number {
    return (whole * percentage) / 100;
  }

  substractPercentage(whole: number, percentage: number): number {
    const percentToSubstract = (whole * percentage) / 100;
    return whole-percentToSubstract
  }

  findHighestRunnerNumber(array: number[]): number {
    if(array.length === 0) {
      return 0
    }
    let highest = array[0];
    for (let i = 1; i < array.length; i++) {
      const e = array[i];
      if(e > highest) {
        highest = e
      }
      
    }

    return highest
  }

  createThreeDigits(number: number): string {
    const threeDigits =  number.toString().padStart(3,'0')
    return threeDigits
  }

  generateID(): number {
    const min = 100000000; // Minimum 9-digit number
    const max = 999999999; // Maximum 9-digit number

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }

  saveRunner(preferenceID: string, initPoint: string, status: string){
    let _runner = {
      runnerNumber: this.createThreeDigits(this.findHighestRunnerNumber(this.runnerNbrs)+1),
      name: this.runner.name,
      email: this.runner.email,
      partnerID: this.runner.partnerCode,
      catValue: this.runner.circuito,
      runnerAge: this.runner.edad,
      dni: this.runner.dni,
      runnerBirthDate: this.runner.fecha_nac,
      runnerGenre: this.runner.genero,
      status: "pending",
      status_detail: status,
      tshirtSize: this.runner.talle,
      preference_id: preferenceID,
      payment_amount: this.toPay
    }
    this.paymentService.createRunner(_runner).subscribe({
      complete: () => {
        this.navigateToUrl(initPoint)
      }
    })
  }
  

  createPayment(){
    this.loading = true
    this.visible = false
    let initPoint: string;
    let reference_id: string;
    let id: string = this.generateID().toString();
    let status: string;
    this.paymentData.title = `Inscripcion MMRun 2023 ${id}`

    localStorage.setItem('reference_id', this.paymentData.title)

    reference_id = this.paymentData.title
    this.paymentService.createPreference(this.paymentData).subscribe(
      {
        next: (data) => {
          console.log(data),
          initPoint = data.body.init_point
          status = data.reference_id

        },
        error: (e) => console.log(e),
        complete: () => {
          this.paymentService.getRunners().subscribe({
            next: (runners) => {
              for (let i = 0; i < runners.length; i++) {
                const e = runners[i];
                this.runnerNbrs.push(Number(e.runnerNumber))
              }
            },
            error: (e) => console.error(e),
            complete: () => {
              this.saveRunner(reference_id, initPoint, status)
            }
          });
          
        },
      }
    )
  }

  showDialog() {
    this.loading = true
    this.visible = !this.visible
  }

  navigateToUrl(url: string) {
    window.location.href = url
  }

  navigateBack() {
    this.router.navigate(['/'])
  }

}
