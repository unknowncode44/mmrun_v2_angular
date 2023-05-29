import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CategoriesPrices } from 'src/app/home/mock/cat-prices.mock';
import { CategoryPrices } from 'src/app/home/mock/cat-prices.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CategoriesService } from 'src/app/dashboard/categories/services/categories.service';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as e from 'express';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit{

  constructor(
    private router: Router,
    private categoriesService: CategoriesService
    ){}


  catPrices: CategoryPrices[] = CategoriesPrices
  catPrices2: CategoryPrices[] = []
  formGroup: FormGroup
  circGroup: FormGroup

  mClubPartner: boolean = false
  discountCode: boolean = false

  categories = new Observable<any[]>



  ngOnInit(): void {
    this.circGroup = new FormGroup({
      catPriceControl: new FormControl<string>(null, Validators.required),
    })

    this.categories = this.categoriesService.getAll()

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

  goToPayment() {
    let runner = {
      circuito: '',
      name: '',
      dni: '',
      email: '',
      genero: '',
      fecha_nac: '',
      edad: '',
      talle: '',
      partner: false,
      discount: false,
    }
    let circValue = this.circGroup.value.catPriceControl
    if(circValue === null || circValue === 'null'){
      alert('Tienes que elegir un circuito')
    } else {

      runner.circuito = circValue

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
        runner.fecha_nac  = personalValues.fecha_nac
        runner.talle      = personalValues.talle

        console.warn(runner.fecha_nac);
        
        if(
          this.formGroup.controls['mClubPartnerStr'].enabled && 
          personalValues.mClubPartnerStr === null){
          alert('Debes Ingresar el Numero de Socio')
        }

        else {
          var partner = this.checkPartnerNumber(this.formGroup.controls['mClubPartnerStr'].value)
          runner.partner = partner
          if(
            this.formGroup.controls['discCodeStr'].enabled && 
            personalValues.discCodeStr === null){
              alert('Debes Ingresar Codigo de Descuento')
            }

            else {
              var discount = this.checkDiscountCode(this.formGroup.controls['discCodeStr'].value)
              runner.discount = discount

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
