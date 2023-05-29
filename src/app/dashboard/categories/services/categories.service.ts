import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  categoriesUrl: string = 'http://31.187.76.251:3040/categories'

  constructor(private http: HttpClient) {

  }

  getAll(): Observable<any> {
    return this.http.get(this.categoriesUrl)
  }

  addOne(category: any): Observable<any> {
    return this.http.post(this.categoriesUrl, category)
  }

  update(id: string, category: any): Observable<any> {
    let url = `${this.categoriesUrl}/${id}`
    return this.http.put(url, category)
  }

  delete(id: string): Observable<any> {
    let url = `${this.categoriesUrl}/${id}`
    return this.http.delete(url)
  }
}
