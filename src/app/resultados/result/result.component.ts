import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {

  runner: any

  constructor(private ar: ActivatedRoute){}

  ngOnInit(): void {
    this.ar.paramMap.subscribe({
      next: (params) => {
        this.runner = JSON.parse(params.get('runner'))
        console.log(this.runner);
      }
    })
  }

}
