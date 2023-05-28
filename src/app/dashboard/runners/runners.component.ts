import { Component, OnInit } from '@angular/core';
import { Runner } from 'src/app/models/runner.model';



@Component({
  selector: 'app-runners',
  templateUrl: './runners.component.html',
  styleUrls: ['./runners.component.scss']
})
export class RunnersComponent implements OnInit{
  runnerMock: Runner[] = [
    {
      runnerNumber: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      partnerID: 5678,
      catValue: "21k",
      runnerAge: "30",
      dni: "123456789",
      runnerBirthDate: "1992-05-15",
      runnerGenre: "Masculino",
      status: "accredited",
      status_detail: "",
      tshirtSize: "M",
    },
    {
      runnerNumber: 2,
      name: "Alexa Doe",
      email: "Alexadoe@example.com",
      partnerID: 5679,
      catValue: "10k",
      runnerAge: "28",
      dni: "123456798",
      runnerBirthDate: "1993-05-15",
      runnerGenre: "Femenino",
      status: "pending",
      status_detail: "",
      tshirtSize: "M",
    }, 
  ]

  cols: any[]

  runnersqty: number
  
  
  ngOnInit() {
    this.cols = [
      {field:'runnerNumber', header: '# Corredor'},
      {field:'name', header: 'Nombre'},
      {field:'email', header: 'Email'},
      {field:'runnerAge', header: 'Edad'},
      {field:'dni', header: 'DNI'},
      {field:'runnerBirthDate', header: 'Fecha Nac'},
      {field:'runnerGenre', header: 'Genero'},
      {field:'tshirtSize', header: 'Talle'},
      {field:'catValue', header: 'Circuito'},
      {field:'partnerID', header: 'Socio'},
      {field:'status', header: 'Estado'},
      {field: 'actions', header: 'Acciones'}
      
    ]
    this.runnersqty = this.runnerMock.length
    
  }

  getSeverity(status: string) {
    switch (status) {
      case 'accredited':
        return 'success';
      case 'pending':
        return 'warning';
      default: 
        return 'danger'
    }
  }


}
