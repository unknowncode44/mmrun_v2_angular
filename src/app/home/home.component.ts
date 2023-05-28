import { Component, ViewEncapsulation } from '@angular/core';
import { SharedService } from './services/shared/sared.service';
import { MenuItem } from './mock/menu-item.model';
import { menuItems } from './mock/menu-sections';
import { Category } from 'src/app/home/mock/cat-item.model';
import { cards } from 'src/app/home/mock/categories.mock';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesPrices } from 'src/app/home/mock/cat-prices.mock';
import { CategoryPrices } from 'src/app/home/mock/cat-prices.model';
import { Router} from '@angular/router'

import { UiService } from '../dashboard/ui/services/ui.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {

  opened: boolean = false
  menu_cats: MenuItem[] = menuItems

  formGroup: FormGroup
  
  cardCat: Category[] = cards
  catPrices: CategoryPrices[] = CategoriesPrices

  uiList: any[] = [] 

  tituloEncabezado = ''
 

  constructor(
    private sServ: SharedService, 
    private router: Router,
    private uiService: UiService
    
    ){

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

    console.log(this.tituloEncabezado);
    
    
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
