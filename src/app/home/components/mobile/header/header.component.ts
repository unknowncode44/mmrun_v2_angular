import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle'

import { UiService } from 'src/app/dashboard/ui/services/ui.service';

register()

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  uiList: any[] = []
  tituloEncabezado: string = ''
  textoEncabezado: string = ''

  constructor(private uiService: UiService){
    
  }

  ngOnInit(): void {
    this.uiService.getAll().subscribe(
      (data) => {
        this.uiList = data
        for (let i = 0; i < this.uiList.length; i++) {
          const e = this.uiList[i];
          if(e.id === 1){
            this.tituloEncabezado = e.item
          }
          if(e.id === 2){
            this.textoEncabezado = e.item
          }
          
        }
      }
    )
  }

  goToForm(formId: string) : void{
  console.log("touch");
    document.getElementById(formId)
    .scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    })
  }

}
