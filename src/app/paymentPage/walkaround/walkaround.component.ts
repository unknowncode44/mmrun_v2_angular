import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-walkaround',
  templateUrl: './walkaround.component.html',
  styleUrls: ['./walkaround.component.scss']
})
export class WalkaroundComponent implements OnInit{

  name: string = ''
  runnerQuery: string = ''
  runner: any = {}
  id: string = ''

  constructor(private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    
    this.route.paramMap.subscribe( params => {
      this.runnerQuery = params.get('runner')
      
    })

    this.runner = JSON.parse(this.runnerQuery)

    // this.runner = localStorage.getItem('runner')
    this.name = this.runner.name
    this.id = this.runner.runnerNumber
  }

}
