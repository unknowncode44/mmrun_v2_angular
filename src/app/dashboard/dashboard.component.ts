import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  opened: boolean = false
  sidebarType = ''

  constructor(){
    var screenWidth = window.screen.width
    if (screenWidth > 450) {
      this.opened = true
    }
  }

  toggleSidebar(): void {
    if(this.opened){
      this.opened = !this.opened
    }

    else {
      this.opened = !this.opened
    }
  }

}
