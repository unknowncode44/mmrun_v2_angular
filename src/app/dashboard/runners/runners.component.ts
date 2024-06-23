import { Component, OnInit, ViewChild } from '@angular/core';
import { Runner } from 'src/app/models/runner.model';
import { RunnerService } from './services/runner.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'
import { DatePipe } from '@angular/common';
import { RunnerParsed } from './runnerParsed.interface';
import { BehaviorSubject, Observable, Subject, switchMap } from 'rxjs';




@Component({
  selector: 'app-runners',
  templateUrl: './runners.component.html',
  styleUrls: ['./runners.component.scss'],
  providers: [MessageService, DatePipe]
})
export class RunnersComponent implements OnInit{

  cols: any[]

  runnersqty: number

  loaded: boolean = false

  runners: any[]

  refreshRunners$ = new BehaviorSubject<boolean>(false)

  runners$ = this.refreshRunners$.pipe(switchMap(_ => this.runnersService.getAll()))

  parsedRunner: any[] = []

  visible: boolean = false

  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private runnersService: RunnerService,
    private messageService: MessageService,
    private datePipe: DatePipe
    ){}

  ngOnInit() {
    this.cols = [
      {field:'Numero_de_corredor', header: '# Corredor'},
      {field:'Nombre', header: 'Nombre'},
      {field:'Email', header: 'Email'},
      {field:'Edad', header: 'Edad'},
      {field:'DNI', header: 'DNI'},
      {field:'Genero', header: 'Genero'},
      {field:'Talle', header: 'Talle'},
      {field:'Fecha_Nac', header: 'Fecha Nac'},
      {field:'Nro_Socio_MM', header: 'Socio'},
      {field:'Categoria', header: 'Circuito'},
      {field:'Valor_Categoria', header: 'Valor Circuito'},
      {field:'Status', header: 'Estado'},
      {field:'Monto_Abonado', header: 'Monto Abonado'},
      {field:'Descuento', header: '% Desc'},
      {field:'Tipo_de_descuento', header: 'Tipo Desc'},
      {field:'Codigo_de_descuento', header: 'Cod Desc'},
      {field:'Fecha_Creado', header: 'Creado'},
      {field:'actions', header: 'Acciones'}


    ]

    this.runners$.subscribe({
      next: (data) => {
        this.loaded = true;
        this.runners = data
        for (let i = 0; i < this.runners.length; i++) {
          const e = this.runners[i];
          this.parsedRunner.push(this.createParsedRunner(e))
        }
      },
      error: (e) => console.error(e),
    })

  }

  // 230819
  exportToExcel() {
    const date = new Date()
    this.runnersService.exportToExcel(this.parsedRunner, 'Corredores '+date.toISOString(), date.toISOString())
  }

  extractCat(value: string): string {
    const parts = value.split(',')
    return parts[0]

  }

  extracCatCost(value: string): number {
    const regex = /\$ (\d+)/;
    const match = value.match(regex);
    if(match && match[1]){
      return +match[1]
    }
    return 0
  }

  invertDate(date: string) : string {
    const parts = date.split('-');
    if(parts.length === 3) {
      const [year, month, day] = parts
      return `${day}/${month}/${year}`
    }
    return ''
  }

  calculateDiscount(cost: number, paid: number): string {
    const discountAmount = cost - paid;
    const discountPercentage = (discountAmount/cost)*100;
    return `${discountPercentage.toFixed(2)}%`
  }

  identifyDiscount(cost: number, paid: number, partnerID: any | null) : string {
    if(partnerID !== null && cost-paid>0) {
      return 'Desc. Socio MM'
    }
    else if(cost-paid === 0){
      return 'Sin Descuento'
    }
    else {
      return 'Otro Descuento'
    }

  }

  createParsedRunner(runner: any): RunnerParsed {
    const parsedRunner: RunnerParsed = {
      ID                  : runner.id,
      Numero_de_corredor  : runner.id,
      Nombre              : runner.name,
      Email               : runner.email,
      Edad                : runner.runnerAge.toString(),
      DNI                 : runner.dni,
      Genero              : runner.runnerGenre,
      Talle               : runner.tshirtSize,
      Fecha_Nac           : runner.runnerBirthDate, // You might want to use a Date type here if needed
      Nro_Socio_MM        : runner.partnerID,
      Categoria           : this.extractCat(runner.catValue),
      Valor_Categoria     : this.extracCatCost(runner.catValue),
      Status              : runner.status,
      Monto_Abonado       : parseFloat(parseFloat(runner.payment_amount).toFixed(2)),
      Descuento           : this.calculateDiscount(this.extracCatCost(runner.catValue), runner.payment_amount),
      Tipo_de_descuento   : this.identifyDiscount(this.extracCatCost(runner.catValue), Number(runner.payment_amount), runner.partnerID),
      Codigo_de_descuento : runner.discountText,
      Fecha_Creado        : this.invertDate(this.parseDate(runner.createdAt))
    }
    return parsedRunner
  }


  //*
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

  parseDate(datestamp: string): string {
    return datestamp.substring(0,10)
  }

  showResendMailDialog() {
    this.visible = true
  }

  resendEmail(email: string, name: string, distance: string, runnerNumber: string, approved: boolean) {
    let body = {
      email       : email,
      name        : name,
      distance    : distance,
      runnerNumber: runnerNumber,
      approved    : approved
    }
    this.runnersService.resendMail(body)
  }


  deleteRunner(id: number): void {
    this.loaded = false
    this.runnersService.deleteOne(id).subscribe({
      next:() => {
        this.refreshRunners$.next(true)
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
