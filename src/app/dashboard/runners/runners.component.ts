import { Component, OnInit, ViewChild } from '@angular/core';
import { Runner } from 'src/app/models/runner.model';
import { RunnerService } from './services/runner.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'



@Component({
  selector: 'app-runners',
  templateUrl: './runners.component.html',
  styleUrls: ['./runners.component.scss'],
  providers: [MessageService]
})
export class RunnersComponent implements OnInit{

  cols: any[]

  runnersqty: number
  
  loaded: boolean = false

  runners: any[]

  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private runnersService: RunnerService,
    private messageService: MessageService
    ){}
  
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

    this.runnersService.getAll().subscribe({
      next: (data) => this.runners = data,
      error: (e) => console.error(e),
      complete: () => this.loaded = true
    })
    
  }

  getSeverity(status: string) {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      default: 
        return 'danger'
    }
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal)
  }


  deleteRunner(id: number): void {
    this.loaded = false
    this.runnersService.deleteOne(id).subscribe({
      next:() => {
        
      },
      error: (e) => {console.error(e)
      },
      complete: () => {
        // todo: agregar mensaje
        this.messageService.add(
          {
            key: 'tr',
            severity: 'success',
            summary: 'Corredor Eliminado',
          }
        )

        // todo: refrescar tabla
        this.loaded = false;
        this.runnersService.getAll().subscribe({
          next: (data) => this.runners = data,
          error: (e) => console.error(e),
          complete: () => this.loaded = true
        })
      }
    })
  }


}
