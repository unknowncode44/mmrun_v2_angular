import { Component } from '@angular/core';
import { Category } from 'src/app/home/mock/cat-item.model';
import { cards } from 'src/app/home/mock/categories.mock';
import { FormControl, Validators } from '@angular/forms';
import { CategoriesPrices } from 'src/app/home/mock/cat-prices.mock';
import { CategoryPrices } from 'src/app/home/mock/cat-prices.model';

@Component({
  selector: 'app-info-screen',
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.scss']
})


export class InfoScreenComponent {
  catPriceControl = new FormControl<CategoryPrices | null>(null, Validators.required)
  selectCatPriceFormControl = new FormControl('Circuito', Validators.required )
  cardCat: Category[] = cards
  catPrices: CategoryPrices[] = CategoriesPrices


}
