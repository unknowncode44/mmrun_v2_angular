import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle'

register()

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

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
