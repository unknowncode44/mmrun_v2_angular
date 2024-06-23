import { Component, OnInit, ViewChild  } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'
import { SponsorsService } from './service/sponsors.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { apiURL } from '../variables/variables';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.scss'],
  providers: [MessageService]
})
export class SponsorsComponent implements OnInit {


  loaded: boolean = false
  sponsors: any[]

  visible: boolean;
  newFormVisible: boolean

  selectedId: number
  selectedData: {
    id: '',
    nombre: '',
    url: '',
    tipo: '',
    active: '',
  }

  buttonText: string = 'Agregar';
  updatedValue: string ='';
  sponsorForm: FormGroup

  selectedFile: File | null = null 

  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private sponsorsService: SponsorsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService

  ){
    this.visible = false;
    this.newFormVisible = false;
    this.sponsorForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      url: [''],
      active: ['', Validators.required]
    })
  }

  ngOnInit(): void {
      this.sponsorsService.getAll().subscribe({
        next: (data) => this.sponsors = data,
        error: (e) => console.error(e),
        complete: () => {
          this.loaded = true
        }
      })
  }
  


  getSeverity(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      case false:
        return 'danger';
    }
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal)
  }

  saveChanges(){
    let fileurl: string = ''
    this.loaded = false
    if(this.selectedFile){
      const formData = new FormData();
      formData.append('file', this.selectedFile)
      this.sponsorsService.uploadFile(formData).subscribe({
        next: (res) => fileurl = apiURL+'/upload/'+res.file,
        complete: () => {
          let _active = false
          if(this.sponsorForm.controls['active'].value){
            _active = true}
          let sponsor = {
            sponsorName: this.sponsorForm.controls['nombre'].value,
            tipo: this.sponsorForm.controls['tipo'].value,
            imgUrl: fileurl,
            active: _active
          }
          
          this.sponsorsService.createOne(sponsor).subscribe({
            next: (res) => console.log(res),
            error: (e) => console.error(e),
            complete: () => {
              this.openDialog()
              this.sponsors = [];
              this.sponsorsService.getAll().subscribe({
                next: (data) => this.sponsors = data,
                error: (e) => console.error(e),
                complete: () => {
                  this.loaded = true
                }
              })
            }
          })
          
        }
      })
    }

    else {
      console.error('Archivo no seleccionado');
      
    }
  }

  deleteSponsor(id: string){
    this.loaded = false
    this.sponsorsService.deleteOne(id).subscribe({
      error: (e) => console.error(e),
      complete:() => {
        this.sponsors = [];
        this.sponsorsService.getAll().subscribe({
          next: (data) => this.sponsors = data,
          error: (e) => console.error(e),
          complete: () => {
            this.loaded = true
          }
        })
      }
    })
  }

  onFileSelected(event: any){
    this.selectedFile = event.target.files[0]
  }

  openDialog(){
    this.newFormVisible = !this.newFormVisible
  }

}
