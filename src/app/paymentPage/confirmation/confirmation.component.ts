import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RunnerService } from 'src/app/dashboard/runners/services/runner.service';
import { PaymentServiceService } from '../services/payment-service.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit{

  params: any
  paramSuccess: string = ''
  paramPending: string = ''
  param: string
  identification_number: string
  runner: any = {
    name: '',
  }
  queryString: string
  paymentStatusUrl: string

  loading: boolean = true 
  approved: boolean = false

  payment_reference: string

  paymentStatus: string = ''
  paymentStatusString: string
  reference: string
  payment_id: string | null
  mail: string

  runners: any = []

  constructor(
    private ar: ActivatedRoute,
    private runnersService: RunnerService,
    private paymentService: PaymentServiceService,
    ){

    
  }

  ngOnInit(): void {
    this.loading = true

    this.ar.params.subscribe({
      next: (param) => {
        
        this.param = `${param['param?']}`
        this.identification_number = `${param['id?']}`
        
        console.info(`Parametro encontrado, resultado del pago: ${param['param?']}`)
        console.info(`Parametro encontrado, identificacion del pago: ${param['id?']}`)

        if(this.param !== '' && this.identification_number !== ''){
          console.info(`Se completo la obtencion de parametros y los mismos no son strings vacios, procedemos buscar el usuario`)

          setTimeout( () => {
            this.runnersService.getAll().subscribe({
              next: (obtained_runners) => {
                this.runners = []
                this.runners = obtained_runners
                console.info(`Runners encontrados correctamente`)
                if(this.runners.length > 0) {
  
                  console.info('Existe mas de un corredor, procediendo a identificar el pagador')
                  
                  //this.loading = false
  
                  for (let i = 0; i < this.runners.length; i++) {
                    const e1 = this.runners[i];
                    this.loading = true
                    console.info(`Corredor ${e1.runnerNumber} identificado con id: ${e1.identification_number}`)
  
                    if(e1.identification_number === this.identification_number) {
                      console.info('Corredor encontrado, asignadolo a Runner y cambiando Variables')
                      this.runner = e1
                      if(this.param === 'success'|| this.param === 'exito'){
                        this.paymentStatus = 'approved'
                        this.paymentStatusString = 'Pago confirmado!'
                        this.approved = true
                        this.runner.status = 'approved',
                        this.mail = this.runner.email
                        this.loading = true
                        this.runnersService.updateOne(this.runner.id, this.runner).subscribe({
                          error: (error3) => console.error(`Hubo un error durante la actualizacion del usuario: ${error3}`),
                          complete() {
                              console.info('Tercera Subscripcion Completa [RUNNER UPDATE]')
                              console.log('Corredor actualizado'); 
                              
                          },
                        })
                        this.loading = false 
                      }
                        break
                    }
                    else {
                      this.paymentStatus = 'pending'
                      this.paymentStatusString = 'Pago en proceso de confirmación'
                      this.approved = false
                      //this.loading = false
                    }
                  }
  
                }
              },
              error: (error2) =>  console.error(`Hubo un error en la obtencion de usuarios ${error2}`),
              complete: () => {
                this.loading = false
                console.info('Segunda Subscripcion Completa [RUNNERS]')
              }
            })
          }, 8000)
        }

        else {
          console.log('No se completo la obtencion de parametros, chequeando localstorage')

          if(localStorage.getItem('runner') !== undefined ) {
            this.runner = JSON.parse(localStorage.getItem('runner'));
            console.info('LS Runner Encontrado');

            this.runnersService.getAll().subscribe({
              next: (obtained_runners) => {
                this.runners = obtained_runners
                console.info(`Runners encontrados correctamente - LS IF`)
              },
              error: (error2) =>  console.error(`Hubo un error en la obtencion de usuarios ${error2}`),
              complete: () => {
                console.info('Subscripcion Completa [RUNNERS - LS-IF]')
                if(this.runners.length > 0) {
                  console.info('Existe mas de un corredor, procediendo a identificar el pagador')
                  
                  for (let i = 0; i < this.runners.length; i++) {
                    const e1 = this.runners[i];
                    if(
                      e1.id !== null && 
                      e1.id === this.runner.id) {
                        console.info('Corredor encontrado, asignadolo a Runner y cambiando Variables')
                        this.runner = e1
                        if(this.param === 'success'){
                          this.paymentStatus = 'approved'
                          this.paymentStatusString = 'Pago confirmado!'
                          this.runner.status = 'approved',
                          this.mail = this.runner.email
                          this.approved = true
                          this.runnersService.updateOne(this.runner.id, this.runner).subscribe({
                            error: (e) => console.error(e),
                            complete() {
                              console.info('Subscripcion Completa [RUNNER UPDATE - LS IF]')
                              console.log('Corredor actualizado'); 
                              this.loading = false 
                            },
                          })
                        }
                        break
                      }
                  }
                }
              }
            })
          }
          
          else {
            console.log('no existe runner en localstorage')
          }
          // else if(localStorage.getItem('reference_id') !== undefined) {
          //   this.payment_reference = localStorage.getItem('reference_id')
          //   console.info('LS Reference Encontrado');
          // }

        }
        
      },
      error: (error) => console.error(`Hubo un error en subscribe de los parametros: ${error}`),
      complete: () => {
        console.info('Primera Subscripcion Completa [PARAMETROS]')
        
      }
    })


    
    // this.ar.params.subscribe({
    //   next: (param) => {
    //     console.log(param['param?'])
    //     console.log(param['id?'])
        
    //     this.param = `${param['param?']}`
    //     this.identification_number = `${param['id?']}`

    //     if(this.param === 'success'){
          
    //       this.paymentStatus = 'approved'
    //       this.paymentStatusString = 'Pago confirmado!'
    //       this.approved = true
    //       this.loading = false

    //       if(reference !== null && reference !== '') {
    //         console.log('aca1');
            
    //         this.loading = true
    //         this.runnersService.getAll().subscribe({
    //           next: (runners) => {
    //             this.runners = runners
    //             console.log('aca2');
                
    //             console.log(this.runners);
    //           },
    //           error: (e) => console.error(e.toString()),
    //           complete: () => {
    //             this.loading = true
    //             setTimeout(() => {
    //               for (let i = 0; i < this.runners.length; i++) {  
    //                 const e = this.runners[i];
    //                 console.log(e);
                    
    //                 if(e.preference_id === reference) {
  
    //                   console.log('encontrado');
                      
    //                   console.log(JSON.stringify(e));
    //                   this.runner = e
    //                   this.loading = false
    //                   break
    //                 }
    //               }
    //               this.runner.status = 'approved',
    //               this.mail = this.runner.email
    //               this.runnersService.updateOne(this.runner.id, this.runner).subscribe({
    //                 error: (e) => console.error(e),
    //                 complete() {
    //                     console.log('Corredor actualizado'); 
    //                     this.loading = false 
    //                 },
                    
    //               })
    //               this.loading = false
    //             }, 10000)
                
                
    //           }
              
    //         })
    //         this.loading = false
    //       }

    //       else {
    //         this.loading = false
    //       }
    //     }

    //     else {
    //       this.paymentStatus = 'pending'
    //       this.paymentStatusString = 'Pago en proceso de confirmación'
    //       this.approved = false
    //       this.loading = false

    //       let reference: string = localStorage.getItem('reference_id')
    //       console.log(reference);

    //       if(reference !== null && reference !== '') {
    //         console.log('aca3');
            
    //         this.loading = true
    //         this.runnersService.getAll().subscribe({
    //           next: (runners) => {
    //             this.runners = runners
               
    //           },
    //           error: (e) => console.error(e),
    //           complete: () => {
    //             for (let i = 0; i < this.runners.length; i++) {
    //               const e = this.runners[i];
    //               if(e.preference_id === reference) {
    //                 console.log('aca4');
                    
    //                 console.log(JSON.stringify(e))
    //                 this.runner = e
    //                 break
    //               }
    //             }
    //             this.runner.status = 'pending',
    //             this.mail = this.runner.email
    //             this.runnersService.updateOne(this.runner.id, this.runner).subscribe({
                  
    //               error: (e) => console.error(e),
    //               complete() {
    //                   console.log('Corredor actualizado');  
    //                   this.loading = false
    //               },
    //             })
    //             this.loading = false
    //           }
    //         })
    //       }

    //       else {
    //         this.loading = false
    //       }


    //     }
        
        
    //   },
    //   error: (e) => console.error(e),
      
    // })



    // let reference: string = localStorage.getItem('reference_id')
    // console.log(reference);

    // if(reference !== '') {
    //   this.runnersService.getAll().subscribe({
    //     next: (runners) => {
    //       for (let i = 0; i < runners.length; i++) {
    //         const e = runners[i];
    //         if(e.preference_id === reference) {
    //           this.runner = e
    //           break
    //         }
    //       }
    //     },
    //     error: (e) => console.error(e),
    //     complete: () => {
    //       this.runner.status = this.paymentStatus,
    //       this.runner.paymentStatusCheckUrl = 'https://mmrun.com.ar/#/confirmation?'+this.queryString
    //       this.mail = this.runner.email
    //       this.runnersService.updateOne(this.runner.id, this.runner).subscribe({
    //         error: (e) => console.error(e),
    //         complete() {
    //             console.log('Corredor actualizado');  
    //         },
            
    //       })
    //       this.loading = false
    //     }
    //   })
    // }
    

    // this.ar.queryParams.subscribe({
    //   next: (params) => {
    //     console.log(params)
    //     this.params = params;
    //     this.queryString = this.generateQueryString(this.params)
    //   }, 
    //   error: (e) => console.error(e),
    //   complete: () => {

    //   }
      
    // })


    // if(this.params !== null && this.params.merchant_order_id !== null) {
    //   this.paymentService.createMerchantNotification(this.params.merchant_order_id).subscribe({
    //     next: (res) => {
    //       console.log(res)
    //       this.paymentStatus = res.status
    //       if(this.paymentStatus === 'approved') {
    //         this.approved = true
    //         this.runnersService.getAll().subscribe({
    //           next: (runners) => {
    //             for (let i = 0; i < runners.length; i++) {
    //               const e = runners[i];
    //               if(e.preference_id === res.reference) {
    //                 console.log('Encontrado');
    //                 this.loading = false
    //                 this.runner = e
    //                 this.runner.status = this.paymentStatus,
    //                 this.runner.merchant_order_id = this.params.merchant_order_id
    //                 this.runner.paymentStatusCheckUrl = 'https://mmrun.com.ar/#/confirmation?'+this.queryString
    //                 this.mail = this.runner.email
    //                 this.runnersService.updateOne(this.runner.id, this.runner).subscribe({
    //                   error: (e) => console.error(e),
    //                   complete() {
    //                       console.log('Corredor actualizado');  
    //                   },
                      
    //                 })
    //                 break
                    
    //               }
    //             }
    //           }
    //         })
    //       }
    //       else {
    //         this.runnersService.getAll().subscribe({
    //           next: (runners) => {
    //             for (let i = 0; i < runners.length; i++) {
    //               const e = runners[i];
    //               if(e.preference_id === res.reference) {
    //                 this.runner = e
    //                 break
    //               }
    //             }
    //           },
    //           error: (e) => console.error(e),
    //           complete: () => {
    //             this.runner.status = this.paymentStatus,
    //             this.runner.paymentStatusCheckUrl = 'https://mmrun.com.ar/#/confirmation?'+this.queryString
    //             this.mail = this.runner.email
    //             this.runnersService.updateOne(this.runner.id, this.runner).subscribe({
    //               error: (e) => console.error(e),
    //               complete() {
    //                   console.log('Corredor actualizado');  
    //               },
                  
    //             })
    //             this.loading = false
    //           }
    //         })
    //       }
    //     },
    //     error: (e) => console.error(e),
    //     complete: () => {
          
          
    //       if(this.paymentStatus !== 'approved') {
    //         this.paymentStatusString = 'Pago en proceso de confirmación'
    //       }
    //       else {
    //         this.paymentStatusString = 'Pago confirmado!'
    //       }
          
    //     }
    //   })
    // }




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
