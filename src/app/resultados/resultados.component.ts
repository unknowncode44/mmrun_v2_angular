import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as results from '../../assets/files/mari_menuco_2023.json'

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss']
})
export class ResultadosComponent implements OnInit{

  @ViewChild('rn') rn: ElementRef;
  dni_checked: boolean = true
  rnb_checked: boolean = false
  placeHolder: string

  runner_data: string

  mock_data = results

  constructor(private router: Router){}

  ngOnInit(): void {
      if(this.dni_checked === true) {
        this.placeHolder = 'Ingresa DNI'
      }

      else {
        this.placeHolder = 'Ingresa Nro. De Corredor'
      }
  }

  check() {
    if(this.dni_checked === true) {
      this.rnb_checked = true
      this.dni_checked = false
      this.placeHolder = 'Ingresa Nro. De Corredor'
    }

    else {
      this.rnb_checked = false
      this.dni_checked = true
      this.placeHolder = 'Ingresa DNI'
    }
  }

  getRN(): string {
    const inputValue = this.rn.nativeElement.value;
    return inputValue
  }

  navigateResult() {
    let runnerNumber: string = this.getRN()

    let runner: any

    for (let i = 0; i < this.mock_data.length; i++) {
      const e = this.mock_data[i];

      if(e.dorsal.toString() === runnerNumber) {
        runner = e
      }
    }

    let string_runner = JSON.stringify(runner)

    this.router.navigate([`result/${string_runner}`])

  }



}
