import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL } from '../../variables/variables';

@Injectable({
  providedIn: 'root'
})
export class RunnerService {

  url: string = apiURL+'/runners'

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.http.get(this.url)
  }

  updateOne(id: number, runner: any) : Observable<any> {
    let urlID: string = this.url+'/'+id.toString()
    return this.http.put(urlID, runner)
  }

  deleteOne(id: number) : Observable<any> {
    let urlID: string = this.url+'/'+id.toString()
    return this.http.delete(urlID)
  }

}
