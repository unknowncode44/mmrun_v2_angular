import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/dashboard/ui/services/ui.service';

@Component({
  selector: 'app-sec2content',
  templateUrl: './sec2content.component.html',
  styleUrls: ['./sec2content.component.scss']
})
export class Sec2contentComponent implements OnInit {

  uiList: any []
  sec2Title: string = ''
  sec2Text1: string = ''
  sec2Text2: string = ''

  constructor(private uiService: UiService) {}

  ngOnInit(): void {
      this.uiService.getAll().subscribe(
        (data) => {
          this.uiList = data
          for (let i = 0; i < this.uiList.length; i++) {
            const e = this.uiList[i];
            if(e.id === 3) {
              this.sec2Title = e.item
            }
            if(e.id === 4) {
              this.sec2Text1 = e.item
            }
            if(e.id === 5) {
              this.sec2Text2 = e.item
            }
            
          }
        }
      )
  }
}
