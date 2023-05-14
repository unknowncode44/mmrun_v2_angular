import { Component, Output } from '@angular/core';
import { SharedService } from '../../services/shared/sared.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})



export class ToolbarComponent {

  @Output() opened: boolean = false

  constructor(private sServ: SharedService ){
  }

  onToggle() {
    this.opened = !this.opened
    this.sServ.setValue(this.opened)
    console.log(this.opened);
        
  }


}
