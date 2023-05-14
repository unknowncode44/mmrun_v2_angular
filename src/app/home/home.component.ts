import { Component } from '@angular/core';
import { SharedService } from './services/shared/sared.service';
import { MenuItem } from './mock/menu-item.model';
import { menuItems } from './mock/menu-sections';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  opened: boolean = false
  menu_cats: MenuItem[] = menuItems

  constructor(private sServ: SharedService){

  }

  ngOnInit(): void {
    this.sServ.getValue().subscribe((bln) => this.opened = bln)
  }

  onSelect(){
    this.sServ.setValue(false)
  }
  


}
