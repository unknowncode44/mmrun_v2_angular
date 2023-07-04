import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RunnerService } from 'src/app/dashboard/runners/services/runner.service';
import { PaymentServiceService } from '../services/payment-service.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit{

  params: any
  runner: any
  queryString: string
  paymentStatusUrl: string

  loading: boolean = true 
  approved: boolean = false

  paymentStatus: string = 'approved'
  paymentStatusString: string
  reference: string
  payment_id: string | null
  mail: string

  constructor(
    private ar: ActivatedRoute,
    private runnersService: RunnerService,
    private paymentService: PaymentServiceService,
    private router: Router,
    ){
    
  }

  ngOnInit(): void {
    this.loading = true

    let reference: string = localStorage.getItem('reference_id')
    console.log(reference);

    if(reference !== '') {
      this.runnersService.getAll().subscribe({
        next: (runners) => {
          for (let i = 0; i < runners.length; i++) {
            const e = runners[i];
            if(e.preference_id === reference) {
              this.runner = e
              break
            }
          }
        },
        error: (e) => console.error(e),
        complete: () => {
          this.runner.status = this.paymentStatus,
          this.runner.paymentStatusCheckUrl = 'https://mmrun.com.ar/#/confirmation?'+this.queryString
          this.mail = this.runner.email
          this.runnersService.updateOne(this.runner.id, this.runner).subscribe({
            error: (e) => console.error(e),
            complete() {
                console.log('Corredor actualizado');  
            },
            
          })
          this.loading = false
        }
      })
    }
    

    this.ar.queryParams.subscribe({
      next: (params) => {
        console.log(params)
        this.params = params;
        this.queryString = this.generateQueryString(this.params)
      }, 
      error: (e) => console.error(e),
      complete: () => {

      }
      
    })


    if(this.params !== null && this.params.merchant_order_id !== null) {
      this.paymentService.createMerchantNotification(this.params.merchant_order_id).subscribe({
        next: (res) => {
          console.log(res)
          this.paymentStatus = res.status
          if(this.paymentStatus === 'approved') {
            this.approved = true
            this.runnersService.getAll().subscribe({
              next: (runners) => {
                for (let i = 0; i < runners.length; i++) {
                  const e = runners[i];
                  if(e.preference_id === res.reference) {
                    console.log('Encontrado');
                    this.loading = false
                    this.runner = e
                    this.runner.status = this.paymentStatus,
                    this.runner.merchant_order_id = this.params.merchant_order_id
                    this.runner.paymentStatusCheckUrl = 'https://mmrun.com.ar/#/confirmation?'+this.queryString
                    this.mail = this.runner.email
                    this.runnersService.updateOne(this.runner.id, this.runner).subscribe({
                      error: (e) => console.error(e),
                      complete() {
                          console.log('Corredor actualizado');  
                      },
                      
                    })
                    break
                    
                  }
                }
              }
            })
          }
          else {
            this.runnersService.getAll().subscribe({
              next: (runners) => {
                for (let i = 0; i < runners.length; i++) {
                  const e = runners[i];
                  if(e.preference_id === res.reference) {
                    this.runner = e
                    break
                  }
                }
              },
              error: (e) => console.error(e),
              complete: () => {
                this.runner.status = this.paymentStatus,
                this.runner.paymentStatusCheckUrl = 'https://mmrun.com.ar/#/confirmation?'+this.queryString
                this.mail = this.runner.email
                this.runnersService.updateOne(this.runner.id, this.runner).subscribe({
                  error: (e) => console.error(e),
                  complete() {
                      console.log('Corredor actualizado');  
                  },
                  
                })
                this.loading = false
              }
            })
          }
        },
        error: (e) => console.error(e),
        complete: () => {
          
          
          if(this.paymentStatus !== 'approved') {
            this.paymentStatusString = 'Pago en proceso de confirmación'
          }
          else {
            this.paymentStatusString = 'Pago confirmado!'
          }
          
        }
      })
    }




  }


  generateQueryString(obj: any): string {
    const params = new URLSearchParams();

    for (const key in obj) {
      if(obj.hasOwnProperty(key)) {
        params.set(key, obj[key]);
      }
    }

    return params.toString()
  }

}
