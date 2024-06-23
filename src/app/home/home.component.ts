import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { SharedService } from './services/shared/sared.service';
import { MenuItem } from './mock/menu-item.model';
import { menuItems } from './mock/menu-sections';
import { Category } from 'src/app/home/mock/cat-item.model';
import { cards } from 'src/app/home/mock/categories.mock';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesPrices } from 'src/app/home/mock/cat-prices.mock';
import { CategoryPrices } from 'src/app/home/mock/cat-prices.model';
import { Router} from '@angular/router'

import {Swiper} from 'swiper'



import { UiService } from '../dashboard/ui/services/ui.service';
import { SponsorsService } from '../dashboard/sponsors/service/sponsors.service';

interface ResourcesFile {
  title: string,
  url: string
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements AfterViewInit{


  opened: boolean = false
  menu_cats: MenuItem[] = menuItems

  formGroup: FormGroup
  
  cardCat: Category[] = cards
  catPrices: CategoryPrices[] = CategoriesPrices

  uiList: any[] = [] 

  tituloEncabezado = ''

  resources: ResourcesFile[] = [
    {
      title: "Reglamento y Guias",
      url: '../assets/files/04_reglamento_general_y_guias.pdf'  
    },
    {
      title: "Planilla de acompañantes",
      url: '../assets/files/03_planilla_de_acompanantes.pdf'  
    },
    {
      title: "Deslinde de responsabilidad",
      url: '../assets/files/02_deslinde_de_responsabilidad.pdf'  
    },
    {
      title: "Certificado Médico",
      url: '../assets/files/01_certificado_medico.pdf'
    },
  ]

  sponsors1: string[] = [
    '../../assets/images/MMR2022/Logo----Blanco-PNG.png',
  ]

  sponsors2: string[] = [
    '../../assets/images/MMR2022/Logo----Blanco-PNG.png',
    
  ]

  resources2: string[] = [
    'Documento 1', 'Documento 2', 'Documento 3', 'Documento 4', 'Documento 5'
  ]
 

  constructor(
    private sServ: SharedService, 
    private router: Router,
    private uiService: UiService,
    private sponsorService: SponsorsService
    
    ){

  }

  ngAfterViewInit(): void {
      const swiper0 = new Swiper('.swiper-container0', {
        autoplay: {
          delay: 2500,
          reverseDirection: false,
          disableOnInteraction: false
        },
        loop: true,
        autoHeight: true
      })
      const swiper1 = new Swiper('.swiper-container1', {
        autoplay: {
          delay: 2000,
          reverseDirection: true,
          disableOnInteraction: false
        },
        loop: true,
        autoHeight: true
      })


  }

  ngOnInit(): void {
    this.sServ.getValue().subscribe((bln) => this.opened = bln)
    this.formGroup = new FormGroup({
      catPriceControl: new FormControl<CategoryPrices | null>(null, Validators.required),
      name: new FormControl<string>(null, Validators.required),
      lastname: new FormControl<string>(null, Validators.required),
      email: new FormControl<string>(null, Validators.required)
    })

    this.uiService.getAll().subscribe(
      (data) => {
        this.uiList = data
      }
    )
    for (let uiElement = 0; uiElement < this.uiList.length; uiElement++) {
      const e = this.uiList[uiElement];
      console.log(e);
      
    }

    this.sponsorService.getAll().subscribe({
      next: (res) => {
        for (let i = 0; i < res.length; i++) {
          const e  = res[i];
          if(e.tipo === 'Auspicia'){
            this.sponsors1.push(e.imgUrl)
          }
          else {
            this.sponsors2.push(e.imgUrl)
          }
          
        }
      }
    })
    
    
  }

  onSelect(id?: string){
    this.sServ.setValue(false)
    // TODO: pasar parametro

    if (id === 'login') {
      this.router.navigate(['/login'])
    } else {
      if (id) {
        this.goToForm(id)
      }
    }


    
  }

  goToForm(id: string) : void{
    document.getElementById(id)
    .scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    })
  } 
  


}
