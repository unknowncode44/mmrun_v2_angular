import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL } from '../../variables/variables';


@Injectable({
  providedIn: 'root'
})
export class SponsorsService {

  url: string = apiURL+'/sponsors'
  uploadURL: string = apiURL+'/upload'

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.http.get(this.url)
  }

  createOne(sponsor: any): Observable<any> {
    return this.http.post(this.url, sponsor)
  }

  uploadFile(file: FormData):Observable<any> {
    return this.http.post(this.uploadURL, file)
  }

  deleteOne(id: string):Observable<any> {
    let _url: string = this.url+'/'+id
    return this.http.delete(_url)
  }
}
