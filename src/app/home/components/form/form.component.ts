import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CategoriesPrices } from 'src/app/home/mock/cat-prices.mock';
import { CategoryPrices } from 'src/app/home/mock/cat-prices.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CategoriesService } from 'src/app/dashboard/categories/services/categories.service';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import data from '../../../../assets/files/partners1.json'
import { MessageService } from 'primeng/api';
import { PricesService } from 'src/app/dashboard/prices/services/prices.service';



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class FormComponent implements OnInit{

  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private pricesService: PricesService,
    private messageService: MessageService
    ){}


  catPrices: CategoryPrices[] = CategoriesPrices
  catPrices2: CategoryPrices[] = []
  formGroup: FormGroup
  circGroup: FormGroup

  mClubPartner: boolean = false
  discountCode: boolean = false

  partnerOk : boolean = false
  discCode  : boolean = false

  partnerName: string;
  partnerCode: string;

  discountCodeStr: string

  categories = new Observable<any[]>

  discounts: any[] =[]

  discounts2: any[] = []



  ngOnInit(): void {
    this.circGroup = new FormGroup({
      catPriceControl: new FormControl<string>(null, Validators.required),
    })

    this.categories = this.categoriesService.getAll()
    this.pricesService.getAllDiscounts().subscribe({
      next: (data) => {this.discounts = data, console.log(this.discounts);
       },
      error: (e) => console.error(e),
      complete() {
          
      },
      
    })

    this.categories.subscribe(
      (data) => {
        for (let i = 0; i < data.length; i++) {
          const e = data[i];
          
          let section = `${e.title}, $ ${e.precio}`

          let catPri: CategoryPrices = {name: section, price: e.precio}

          this.catPrices2.push(catPri)
          
        }
      }
    )



    this.formGroup = new FormGroup({
      name: new FormControl<string>(null, Validators.required),
      lastname: new FormControl<string>(null, Validators.required),
      email: new FormControl<string>(null, Validators.required),
      dni: new FormControl<number>(null, Validators.required),
      talle: new FormControl<string>(null, Validators.required),
      genero: new FormControl<string>(null, Validators.required),
      fecha_nac: new FormControl<string>(null, Validators.required),
      mClubPartnerStr: new FormControl<string>(null),
      discCodeStr: new FormControl<string>(null),
    })

    if(!this.mClubPartner) {
      this.formGroup.controls['mClubPartnerStr'].disable()
      var input = document.getElementById('mClubPartnerStr')
      input.classList.add('disabled')
    }

    if(!this.discountCode) {
      this.formGroup.controls['discCodeStr'].disable()
      var input = document.getElementById('discCodeStr')
      input.classList.add('disabled')
    }
  }

  
  enableMCP(): void{
    var value = this.formGroup.controls['mClubPartnerStr'].disabled
    if(value){
      this.formGroup.controls['mClubPartnerStr'].enable()
      var input = document.getElementById('mClubPartnerStr')
      input.classList.remove('disabled')
    }
    else {
      this.formGroup.controls['mClubPartnerStr'].disable()
      var input = document.getElementById('mClubPartnerStr')
      input.classList.add('disabled')
    }
    
  }

  enableDC(): void{
    var value = this.formGroup.controls['discCodeStr'].disabled
    if(value) {
      this.formGroup.controls['discCodeStr'].enable()
      var input = document.getElementById('discCodeStr')
      input.classList.remove('disabled')
    }
    else {
      this.formGroup.controls['discCodeStr'].disable()
      var input = document.getElementById('discCodeStr')
      input.classList.add('disabled') 
    }
  }

  async goToPayment() {
    let runner = {
      circuito: '',
      price: '',
      name: '',
      dni: '',
      email: '',
      genero: '',
      fecha_nac: '',
      edad: '',
      talle: '',
      partner: this.partnerOk,
      partnerCode: this.partnerCode,
      partnerName: this.partnerName,
      discount: this.discCode,
      discountCode: this.discountCodeStr
    }
    let circValue = this.circGroup.value.catPriceControl
    if(circValue === null || circValue === 'null'){
      alert('Tienes que elegir un circuito')
    } else {

      runner.circuito = circValue
      console.log(circValue);
      
      for (let i = 0; i < this.catPrices2.length; i++) {
        const e = this.catPrices2[i];
        console.log(e.name);
        
        if(circValue === e.name){
          runner.price = e.price
        }
        
      }
      

      let personalValues = this.formGroup.value

      if(
        personalValues.name       === null ||
        personalValues.lastname   === null ||
        personalValues.dni        === null ||
        personalValues.email      === null ||
        personalValues.genero     === null ||
        personalValues.fecha_nac  === null ||
        personalValues.talle      === null 
      ) {
        alert('Todos los campos son necesarios')
      }

      else {

        runner.name       = `${personalValues.name} ${personalValues.lastname}`
        runner.dni        = personalValues.dni.toString();
        runner.email      = personalValues.email;
        runner.genero     = personalValues.genero;
        runner.fecha_nac  = personalValues.fecha_nac;
        runner.talle      = personalValues.talle;

        //console.warn(runner.fecha_nac);
        
        if(
          this.formGroup.controls['mClubPartnerStr'].enabled && 
          personalValues.mClubPartnerStr === null){
          alert('Debes Ingresar el Numero de Socio')
        }

        else {
          runner.partner = this.validatePartnerNumber()
          if(runner.partner){
            runner.partnerCode = this.partnerCode;
            runner.partnerName = this.partnerName
          }

          if(
            this.formGroup.controls['discCodeStr'].enabled && 
            personalValues.discCodeStr === null){
              alert('Debes Ingresar Codigo de Descuento')
            }

            else {
              this.validateDiscountCode()
              var discount = this.discCode
              runner.discount = discount
              runner.discountCode = this.formGroup.controls['discCodeStr'].value
              runner.edad = this.calculateAge(runner.fecha_nac);
              console.warn(runner);

              const strRunner = JSON.stringify(runner)
              localStorage.setItem('runner', strRunner)

              this.router.navigate(['/payment'])
              
            }
          
        }
      }
    }
  }

  //! TODO OBTENER NUMEROS DE SOCIO
  checkPartnerNumber(nbr: string): boolean {
    console.log(nbr);
    // CHEQUEAR NUMERO DE SOCIO ACA Y DEVOLVER BOOLEANO
    return true
  }

  validatePartnerNumber() : boolean {
    let match: boolean = false
    let partnerCode = this.formGroup.value.mClubPartnerStr
    console.log(partnerCode)
    this.partnerOk = false
    
    for (let i = 0; i < data.length; i++) {
      const e = data[i];
      if(e.Socio.toString() === partnerCode){
        match = true
        this.partnerOk = true
        this.messageService.add({
          key: 'tr', 
          severity: 'success', 
          summary: 'Validado',
          detail: `Socio: ${e.Nombre}` 
        })
        this.partnerName = e.Nombre
        this.partnerCode = e.Socio.toString()
        break
      }
    }
    if(!match){
      this.messageService.add({
        key: 'tr', 
        severity: 'error', 
        summary: 'Numero Invalido',
        detail: 'Por favor revisa el codigo' 
      })
      
    }
    return match
  }


  validateDiscountCode() : boolean {
    let match: boolean = false 
    let discCode = this.formGroup.value.discCodeStr
    console.log(discCode)
    for (let i = 0; i < this.discounts.length; i++) {
      const e = this.discounts[i];
      if(e.tipo === discCode && e.active){
        match = true
        this.discCode = true
        this.messageService.add({
          key: 'tr', 
          severity: 'success', 
          summary: 'Validado',
          detail: `Socio: ${e.tipo}` 
        })
        this.discountCodeStr = e.tipo
        break
      }
      if(!match){
        this.messageService.add({
          key: 'tr', 
          severity: 'error', 
          summary: 'Codigo no existe',
          detail: 'Revisa el codigo' 
        })
      }
      
    }
    return match
  }

  //! OBTENER CODIGOS DE DESCUENTO
  checkDiscountCode(code: string): boolean {
    console.log(code);
    // CHEQUEAR CODIGO DE DESCUENTO Y DEVOLVER BOOLEANO
    return true
  }

  //! CALCULAR EDAD
  calculateAge(date: string): string {
    const today = new Date();
    const birthdate = new Date(date);

    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();

    if(monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    return age.toString()
  }
  


}
