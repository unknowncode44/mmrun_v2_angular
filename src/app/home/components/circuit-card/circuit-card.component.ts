import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { Category } from 'src/app/home/mock/cat-item.model';
import { cards } from 'src/app/home/mock/categories.mock';

@Component({
  selector: 'app-circuit-card',
  templateUrl: './circuit-card.component.html',
  styleUrls: ['./circuit-card.component.scss']
})
export class CircuitCardComponent {

  cardCat: Category[] = cards

  constructor(public router: Router){}

  goToForm(formId: string) : void{
    document.getElementById("regForm")
    .scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    })
    this.router.navigate([], {fragment: formId})
  } 
}

