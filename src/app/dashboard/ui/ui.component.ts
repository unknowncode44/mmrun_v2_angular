import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss', '../runners/runners.component.scss']
})
export class UiComponent implements OnInit {

  uiList: any[] = []

  ngOnInit(): void {
      this.uiList = [
        {
          id: 1,
          name: 'Titulo Encabezado',
          item: 'ESTAS LISTO PARA LA SEGUNDA VUELTA?',
          active: true
        }
      ]
  }

}
