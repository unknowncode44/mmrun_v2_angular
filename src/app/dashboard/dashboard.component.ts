import { Component } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  opened: boolean = false
  sidebarType = ''
  menuItems =  [
    {
      name: 'Corredores',
      icon: 'walk',
      route: 'dashboard/runners'
    },
    {
      name: 'Circuitos',
      icon: 'analytics',
      route: 'dashboard/categories'
    },
    {
      name: 'Precios',
      icon: 'cash',
      route: 'dashboard/pricing'
    },
    {
      name: 'Sponsors',
      icon: 'sparkles',
      route: 'dashboard/sponsors'
    },
    {
      name: 'Diseño',
      icon: 'code-slash',
      route: 'dashboard/ui'
    },
    {
      name: 'Documentos',
      icon: 'document-text',
      route: 'dashboard'
    },
    {
      name: 'Salir',
      icon: 'log-out',
      route: ''
    }
  ]

  constructor(private router: Router){
    var screenWidth = window.screen.width
    if (screenWidth > 450) {
      this.opened = false
    }

    this.navigateTo('dashboard/runners')
  }




  toggleSidebar(): void {
    if(this.opened){
      this.opened = !this.opened
    }

    else {
      this.opened = !this.opened
    }
  }

  navigateTo(route: string){ // usa como parametro la ruta del componente
    this.router.navigateByUrl(route)
  }

}
