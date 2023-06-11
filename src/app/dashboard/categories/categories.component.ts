import { Component, OnInit } from '@angular/core';
import { CategoriesService } from './services/categories.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [MessageService]
})

export class CategoriesComponent implements OnInit {

  visible: boolean;
  newFormVisible: boolean
  selectedId: number;
  selectedData: {
    id: '',
    precio: '',
    title: '',
    largada: '',
    kit_corredor: '',
    categorias: '',
    circuito: '',
  }

  buttonText: string = ''

  updatedValue: string = ''

  categoriesList: any[] = []

  categoriesQty: number

  categoriesForm: FormGroup;

  loaded: boolean = true

  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
    ){
      this.visible = false;
      this.newFormVisible = false,
      this.categoriesForm = this.formBuilder.group({
        precio: ['', Validators.required],
        title: ['', Validators.required],
        largada: ['', Validators.required],
        kit_corredor: ['', Validators.required],
        categorias: ['', Validators.required],
        circuito: ['', Validators.required]
      })
    }

  ngOnInit(): void {
      this.visible = false
      this.loaded  = false
      this.categoriesService.getAll().subscribe({
        next: (data) => this.categoriesList = data,
        error: (e) => console.error(e),
        complete: () => {
          this.loaded = true
        }
        
      })
  }

  showDialog(id: string){
    this.newFormVisible = true
    this.categoriesForm.reset()
    this.buttonText = 'Modificar'
    this.updatedValue = id
    
    for (let i = 0; i < this.categoriesList.length; i++) {
      const e = this.categoriesList[i];
      
      
      if(e.id.toString() === id.toString()) {
        
        
        this.categoriesForm.setValue({
          precio: Number(e.precio),
          title: e.title,
          largada: e.largada,
          kit_corredor: e.kit_corredor,
          categorias: e.categories,
          circuito: e.circuito
        })

        break
      }
    }
  }

  showNewCategoryDialog() {
    this.newFormVisible = true
    this.buttonText = "Crear"
  }

  update() {

    if(this.categoriesForm.invalid){
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
      precio: this.categoriesForm.value.precio.toString(),
      title: this.categoriesForm.value.title,
      largada: this.categoriesForm.value.largada,
      kit_corredor: this.categoriesForm.value.kit_corredor,
      categories: this.categoriesForm.value.categorias,
      circuito: this.categoriesForm.value.circuito
    }

    this.categoriesService.update(this.updatedValue, payload).subscribe({
      next: (data) => {
        this.messageService.add(
          {
            key: 'tr', 
            severity: 'success', 
            summary: 'Se modificó la categoria',
            detail: data.title 
          }
        ); 
      },
      error: (e) => console.error(e),
      complete: () => {
        this.categoriesList = []
        this.loaded  = false
        this.categoriesService.getAll().subscribe({
          next: (data) => this.categoriesList = data,
          error: (e) => console.error(e),
          complete: () => {
            this.loaded = true
            this.newFormVisible = false
            this.buttonText = ''
            this.updatedValue = ''
            this.categoriesForm.reset()
          }
        })
      }
    })

  }

  createOne() {

    if(this.categoriesForm.invalid){
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
      precio: this.categoriesForm.value.precio.toString(),
      title: this.categoriesForm.value.title,
      largada: this.categoriesForm.value.largada,
      kit_corredor: this.categoriesForm.value.kit_corredor,
      categories: this.categoriesForm.value.categorias,
      circuito: this.categoriesForm.value.circuito
    }

    this.categoriesService.addOne(payload).subscribe(
      (data) => {
        this.categoriesList.push(data)
        this.messageService.add(
          {
            key: 'tr', 
            severity: 'success', 
            summary: 'Se creó la categoria',
            detail: data.title 
          }
        );
        this.newFormVisible = false
      },
      (error) => {
        this.messageService.add(
          {
            key: 'tr', 
            severity: 'error', 
            summary: 'Hubo Un Error',
            detail: JSON.stringify(error) 
          }
        );
      }
    )

  }

  saveChanges(){
    if(this.buttonText === 'Crear') {
      this.createOne()
    }
    if(this.buttonText === 'Modificar'){
      this.update()
    }
  }

  delete(id: string) {
    let _id = id.toString()
    this.categoriesService.delete(_id).subscribe(
      () => {
        this.messageService.add(
          {
            key: 'tr', 
            severity: 'success', 
            summary: 'Se borro la categoria',
            
          }
        );
        
        this.categoriesList = []

        this.categoriesService.getAll().subscribe(
          (data) => {
            this.categoriesList = data
          },
          (error) => {
            console.log(error);
          }
        )

      }

    )
  }

  closeDialog(){}

}
