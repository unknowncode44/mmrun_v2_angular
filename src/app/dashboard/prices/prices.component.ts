import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../categories/services/categories.service';
import { PricesService } from './services/prices.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss'],
  providers: [MessageService]
})
export class PricesComponent implements OnInit {
  visible                 : boolean = false;
  newDiscountFormVisible  : boolean = false;
  selectedId?             : number;
  //selectedData
  buttonText              : string  = '';
  updatedValue            : string  = '';
  updatedPriceValue       : string  = '';
  discountList            : any[]   = [];
  pricesList              : any[]   = [];
  discountsLength         : number  = 0;
  pricesLenght            : number  = 0;
  discountForm            : FormGroup
  pricesForm              : FormGroup
  updatedDate             : string
  loaded                  : boolean

  refreshPrices$ = new BehaviorSubject<boolean>(false)
  refreshDiscount$ = new BehaviorSubject<boolean>(false)

  prices$     = this.refreshPrices$.pipe(switchMap(_ => this.pricesService.getAllPrices()))
  discounts$  = this.refreshDiscount$.pipe(switchMap(_ => this.pricesService.getAllDiscounts()))

  constructor(
    private pricesService  : PricesService,
    private formBuilder    : FormBuilder,
    private messageService : MessageService
  ) {

    this.discountForm = this.formBuilder.group({
      discountName: [ ''    , Validators.required],
      tipo        : [ ''    , Validators.required],
      percentage  : [ ''    , Validators.required],
      active      : [ '' ],
    })

    this.pricesForm =  this.formBuilder.group({
      oldPrice: [''],
      newPrice: ['', Validators.required]
    })

    this.pricesForm.controls['oldPrice'].disable()

  }

  ngOnInit(): void {
    this.loaded = false
    this.prices$.subscribe(
      {
        next: (data) => {
          this.loaded = true;
          this.pricesList = data,
          console.log(data);

        },
        error: (e) => console.error(e),
      }

    )
    this.loaded = false
    this.discounts$.subscribe(
      {
        next: (data) => {
          this.loaded = true;
          this.discountList = data
        },
        error: (e) => console.error(e)
      }
    )
  }

  // Mostrar Dialogo Nuevo Descuento
  showNewDiscountDialog() {
    this.newDiscountFormVisible = true
    this.buttonText = 'Crear'
  }

  // Mostrar Dialogo Modificar Descuento
  showUpdateDiscountDialog(id: string) {
    this.buttonText = ''
    this.newDiscountFormVisible = true
    this.discountForm.reset()
    this.buttonText = 'Modificar'
    this.updatedValue = id

    for (let i = 0; i < this.discountList.length; i++) {
      const e = this.discountList[i];
      if(e.id.toString() === id.toString()){
        this.discountForm.setValue({
          discountName: e.discountName,
          tipo        : e.tipo,
          percentage  : e.percentage,
          active      : ['true']
        })
        break
      }
    }
  }

  // Guardar Cambios / Crear descuento
  saveChanges() {
    if(this.buttonText === 'Crear'){
      this.createOne()
    }
    if(this.buttonText === 'Modificar'){
      this.updateDiscount()
    }
  }

  // Crear nuevo descuento
  createOne() {
    if(this.discountForm.invalid){
      this.messageService.add(
        {
          key: 'tr',
          severity: 'error',
          summary: 'Formulario Invalido',
          detail: 'Revisa los campos'
        }
      )
    }

    const payload = {
      discountName: this.discountForm.value.discountName.toString(),
      tipo        : this.discountForm.value.tipo.toString(),
      percentage  : this.discountForm.value.percentage,
      active      : this.getCheckBox(this.discountForm.value.active[0])
    }

    this.pricesService.addOneDiscount(payload).subscribe({
      next: (discount) => {
        this.refreshDiscount$
        this.messageService.add(
          {
            key: 'tr',
            severity: 'success',
            summary: 'Descuento Creado',
            detail: `ID: ${discount.id}`
          }
        )
      },
      error: (e) => {
        this.messageService.add(
          {
            key: 'tr',
            severity: 'error',
            summary: 'Ups hubo un error!',
            detail: `Error: ${e}`
          }
        )
      },
      complete: () => {
        this.newDiscountFormVisible = false;
        this.loaded = false
        this.discountList = []
        this.pricesService.getAllDiscounts().subscribe(
          {
            next: (data) => {
              this.discountList = data
            },
            error: (e) => console.error(e),
            complete: () => {
              this.loaded = true;
            }
          }
        )
      }
    })

  }

  // Modificar descuento
  updateDiscount() {
    this.refreshDiscount$
    if(this.discountForm.invalid){
      this.messageService.add(
        {
          key: 'tr',
          severity: 'error',
          summary: 'Formulario Invalido',
          detail: 'Revisa los campos'
        }
      )
    }

    const payload = {
      discountName: this.discountForm.value.discountName.toString(),
      tipo        : this.discountForm.value.tipo.toString(),
      percentage  : this.discountForm.value.percentage,
      active      : this.getCheckBox(this.discountForm.value.active[0])
    }

    this.pricesService.updateDiscount(Number(this.updatedValue), payload).subscribe({
      next: (discount) => {
        this.messageService.add(
          {
            key: 'tr',
            severity: 'success',
            summary: 'Descuento Modificado',
            detail: `ID: ${discount.id}`
          }
        )
      },
      error: (e) => {
        this.messageService.add(
          {
            key: 'tr',
            severity: 'error',
            summary: 'Ups hubo un error!',
            detail: `Error: ${e}`
          }
        )
      },
      complete: () => {
        this.newDiscountFormVisible = false;
        this.loaded = false
        this.discountList = []
        this.pricesService.getAllDiscounts().subscribe(
          {
            next: (data) => {
              this.discountList = data
            },
            error: (e) => console.error(e),
            complete: () => {
              this.loaded = true;
            }

          }
        )
      }
    })
  }

  // Borrar Descuento
  delete(id: string) {
    let _id = Number(id)
    this.pricesService.deleteDiscount(_id).subscribe({
      next: (success) => {
        this.refreshDiscount$
        this.messageService.add(
          {
            key: 'tr',
            severity: 'success',
            summary: `Se borro el descuento con ID: ${_id}`,

          }
        )
      },
      error: (e) => console.error(e),
      complete: () => {
        this.loaded = false
        this.discountList = []
        this.pricesService.getAllDiscounts().subscribe(
          {
            next: (data) => {
              this.discountList = data
            },
            error: (e) => console.error(e),
            complete: () => {
              this.loaded = true;
            }

          }
        )
      }

    })
  }


  // Mostrar dialogo para modificar precio
  showNewPriceDialog(id: string) {
    this.visible = true
    this.buttonText = 'Cambiar Precio'
    this.updatedPriceValue = id
    for (let i = 0; i < this.pricesList.length; i++) {
      const e = this.pricesList[i];


      if(id === e.id.toString()){
        this.pricesForm.setValue({
          oldPrice: Number(e.precio),
          newPrice: 0
        })
        break
      }
    }
  }

  // Actualizar precio
  updatePrice(id: string) {
    if(this.pricesForm.invalid){
      this.messageService.add(
        {
          key: 'tr',
          severity: 'error',
          summary: 'Formulario Invalido',
          detail: 'Revisa los campos'
        }
      )
    }

    let category = {
      categories: "",
      circuito: "",
      id: 0,
      kit_corredor: "",
      largada: "",
      precio: "",
      title: "",

    }

    for (let i = 0; i < this.pricesList.length; i++) {
      const e = this.pricesList[i];
      if(e.id.toString() == id) {
        category.categories = e.categories,
        category.circuito = e.circuito,
        category.kit_corredor = e.kit_corredor,
        category.largada = e.largada,
        category.precio = this.pricesForm.value.newPrice
        category.title = e.title
        break
      }
    }

    if(category.title !== "") {
      this.pricesService.updatePrice(Number(id), category).subscribe({
        next: (_category) => {
          this.refreshPrices$
          this.messageService.add(
            {
              key: 'tr',
              severity: 'success',
              summary: 'Precio Modificado',
              detail: `ID: ${_category.id}`
            }
          )
        },
        error: (e) => {
          this.messageService.add(
            {
              key: 'tr',
              severity: 'error',
              summary: 'Ups hubo un error!',
              detail: `Error: ${e}`
            }
          )
        },
        complete: () => {
          this.visible = false;
          this.loaded = false
          this.pricesList = []
          this.pricesService.getAllPrices().subscribe(
            {
              next: (data) => {
                this.pricesList = data
              },
              error: (e) => console.error(e),
              complete: () =>  {
                this.loaded = true;
              }
            }

          )
        }
      })
    }
  }


  // Utilidad para parsear fecha
  parseDate(dateString: string) : string {
    let date = new Date(dateString)
    let parsedDate = date.toLocaleDateString()
    return parsedDate
  }

  // Utilidad Badge
  badge(bool: boolean) : { text: string, style: string} {
    if(bool){
      return {text: 'Activo', style: 'success'}
    }
    else {
      return {text: 'Inactivo', style: 'warning'}
    }
  }

  // Utilidad obtener booleano
  getCheckBox(value: string): boolean{
    if(value === 'true'){
      return true
    }
    else {
      return false
    }
  }

}
