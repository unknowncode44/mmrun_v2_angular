import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'
import { Observable } from 'rxjs';

import { CategoriesService } from 'src/app/dashboard/categories/services/categories.service';

import { Category } from 'src/app/home/mock/cat-item.model';
import { cards } from 'src/app/home/mock/categories.mock';

@Component({
  selector: 'app-circuit-card',
  templateUrl: './circuit-card.component.html',
  styleUrls: ['./circuit-card.component.scss']
})
export class CircuitCardComponent implements OnInit {

  cardCat: Category[] = cards

  categories: any[] = []

  isLoading: boolean = true

  categories2 = new Observable<any[]>

  constructor(
    public router: Router,
    private categoriesService: CategoriesService
    ){}
  
  ngOnInit(): void {
      //this.categories2 = this.categoriesService.getAll()
      this.categoriesService.getAll().subscribe(
        (data) => {
          this.categories = data
          this.isLoading = false
        },
        (error) => {
          console.error(error);
        }
      )
  }


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

