import { Component, OnInit } from '@angular/core';
import { UiService } from './services/ui.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss'],
  providers: [MessageService]
})
export class UiComponent implements OnInit {

  visible: boolean;
  selectedId: number
  selectedData = {
    id: '',
    name: '',
    item: ''
  }

  uiList: any[] = []

  constructor(private uiService: UiService, private messageService: MessageService){}

  ngOnInit(): void {
      this.visible = false

      this.uiService.getAll().subscribe(
        (data) => {
          this.uiList = data
        },
        (error) => {
          console.log(error);
          
        }
      )

  }

  showDialog(id: number) {
    
    this.uiList.forEach((item) => {
      if(id === item.id) {
        this.selectedData = {
          id: item.id.toString(),
          name: item.name,
          item: item.item 
        }
      }
    }
    )
    this.visible = true
  }

  closeDialog() {
    this.messageService.add(
      {
        key: 'tr', 
        severity: 'warn', 
        summary: 'Sin Cambios', 
        detail: 'No se guardo ningun cambio'
      }
    )
    this.selectedData = {
      id: '',
      name: '',
      item: ''
    }
    this.visible = false
    
  }

  saveChanges() {
    const newData = {
      item: this.selectedData.item
    }
    this.uiService.updateOne(this.selectedData.id, newData).subscribe(
      (data) => {
        this.uiList.forEach((item) => {
          if(item.id === data.id) {
            item.item = data.item
          }
        })
        this.messageService.add(
          {
            key: 'tr', 
            severity: 'success', 
            summary: 'Se guardaron los datos', 
          }
        );
        this.visible = false
      },
      (error) => {
        this.messageService.add(
          {
            key: 'tr', 
            severity: 'error', 
            summary: 'Hubo un error', 
          }
        )
      }
    )  
  }

  

}
