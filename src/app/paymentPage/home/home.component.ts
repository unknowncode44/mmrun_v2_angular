import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { PaymentServiceService } from '../services/payment-service.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';

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
  paymentData               : any
  categories                : any[]
  prices                    : any[]     = []
  discounts                 : any[]
  priceConcat               : any[]
  partnerDiscount           : number    = 0;
  otherDiscounts            : number    = 0;
  circuitCost               : number    = 0;
  partnerDiscountPercentage : number    = 0;
  couponDiscountPercentage  : number    = 0;
  circuitCostString         : string
  partnertDiscStr           : string
  couponDiscStr             : string
  toPay                     : number    = 0;
  toPayString               : string
  runnerNbrs                : number[]  = []
  loading                   : boolean   = true
  visible                   : boolean   = false
  btnString                 : string    = 'Pagar'
  wlk                       : boolean   = false
  runners                   : any[]     = []

  // runners$      : Observable<any[]>
  refreshRunners$  = new BehaviorSubject<boolean>(false)

  runners$ = this.refreshRunners$.pipe(switchMap(_ => this.paymentService.getRunners()))


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

        // console.log(this.prices);

      }
    })

    this.paymentService.getAllDiscounts().subscribe({
      next: (data) =>  this.discounts = data,
      error: (e) =>  console.error(e),
      complete: () => {
        if(this.runner.discount) {
          for (let i = 0; i < this.discounts.length; i++) {
            const e = this.discounts[i];
            if(this.runner.discountCode.toLowerCase() === e.tipo.toLowerCase()){
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
          user_id: ''
        }
        this.loading = false
      }
    })

    if(this.runner.circuito === "Caminata X Lago , $ 0") {
      this.btnString = 'Confirmar'
      this.wlk = true
    }



    this.runners$.subscribe({
      next: (runners) => {
        this.runners = runners
        this.runnerNbrs = []
        for (let i = 0; i < this.runners.length; i++) {
          const e = this.runners[i];
          this.runnerNbrs.push(+e.runnerNumber)
        }
      }
    })
  }

  ngOnDestroy(): void {
    //localStorage.removeItem('runner')
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
    let plusOne = (highest) + 1
    return plusOne
  }

  createThreeDigits(number: number): string {
    const threeDigits =  (number).toString().padStart(3,'0')
    return threeDigits
  }

  generateID(): number {
    const min = 100000000; // Minimum 9-digit number
    const max = 999999999; // Maximum 9-digit number

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  }

  saveRunner(preferenceID: string, initPoint: string, status: string, identificationNumber: string){
    let _runner = {
      runnerNumber: this.createThreeDigits((this.findHighestRunnerNumber(this.runnerNbrs))),
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
      payment_amount: this.toPay,
      identification_number: identificationNumber,
      discountText: this.runner.discountCode
    }

    // console.log(_runner.runnerNumber);


    //localStorage.setItem('preference_id', preferenceID)
    this.paymentService.createRunner(_runner).subscribe({
      next: async (runner) => {

        this.refreshRunners$.next(true)

        _runner.runnerNumber = runner.id.toString()

        await this.paymentService.updateRunner(runner.id, {"runnerNumber": _runner.runnerNumber})

        localStorage.setItem('runner', JSON.stringify(_runner))
      },
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
    this.paymentData.user_id = id

    localStorage.setItem('reference_id', this.paymentData.title)

    if(this.runner.circuito === "Caminata X Lago , $ 0"){
      let _runner = {
        runnerNumber: this.createThreeDigits((this.findHighestRunnerNumber(this.runnerNbrs))),
        name: this.runner.name,
        email: this.runner.email,
        partnerID: this.runner.partnerCode,
        catValue: this.runner.circuito,
        runnerAge: this.runner.edad,
        dni: this.runner.dni,
        runnerBirthDate: this.runner.fecha_nac,
        runnerGenre: this.runner.genero,
        status: "approved",
        status_detail: status,
        tshirtSize: this.runner.talle,
        preference_id: null,
        payment_amount: this.toPay,
        identification_number: this.generateID().toString(),
        discountText: this.runner.discountCode
      }

      this.paymentService.createRunner(_runner).subscribe({
        next: (runner) => {
          this.refreshRunners$.next(false)
          const newId = runner.id.toString()
          _runner.runnerNumber = newId
          this.paymentService.updateRunner(newId, _runner)
          //localStorage.setItem('runner', runner);
          this.paymentService.sendWalkConfirmationEmail(_runner.email, _runner.name, _runner.runnerNumber, _runner.identification_number).subscribe({
            next: () => this.router.navigate(['/walk', JSON.stringify(_runner)])
          })
        },
      })
    }

    else {
      reference_id = this.paymentData.title
      this.paymentService.createPreference(this.paymentData).subscribe(
        {
          next: (data) => {
            // console.log(data),
            initPoint = data.body.init_point
            status = data.reference_id
          },
          error: (e) => console.log(e),
          complete: () => {

            this.saveRunner(reference_id, initPoint, status, id)
          },
        }
      )
    }
  }

  showDialog() {
    if(this.wlk === true) {
      this.createPayment()
    }
    else {
      this.loading = true
      this.visible = !this.visible
    }
  }

  navigateToUrl(url: string) {
    window.location.href = url
  }

  navigateBack() {
    this.router.navigate(['/'])
  }

}
