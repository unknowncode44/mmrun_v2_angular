import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiURL } from '../../variables/variables';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class RunnerService {

  url: string = apiURL+'/runners'
  mailUrl: string = apiURL+'/mercadopago/sendnewmail'

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

  resendMail(body: any): Observable<any> {
    return this.http.post(this.mailUrl, body)
  }

  exportToExcel(data: any[], filename: string, sheetName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = { Sheets: {[sheetName]:ws} , SheetNames: [sheetName]};
    const excelBuffer: any = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    const blob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
    FileSaver.saveAs(blob, filename+'.xlsx')
  }

}
