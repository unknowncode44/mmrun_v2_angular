import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private opened: BehaviorSubject<boolean>

  constructor() {
    this.opened = new BehaviorSubject<boolean>(false)
  }

  setValue(newValue: boolean): void {
    this.opened.next(newValue)
  }

  getValue(): Observable<boolean> {
    return this.opened.asObservable()
  }
}
