import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ModelService} from '../../model/model.service';
import {Observable, throwError} from 'rxjs';
import {RouteVO} from "../../model/vo/RouteVO";
import {ScatterValueVO} from "../../model/vo/ScatterValueVO";
import {ScatterVO} from "../../model/vo/ScatterVO";
import {ControlValueVO} from "../../ui-controls/vos/ControlValueVO";

@Injectable()
export class LandingService {


  public onServiceChanged:EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient,private model:ModelService) {}

  public loadAllLevels():Observable<any>{
    const url:string = this.model.config.serviceURL+'?action=levels';
    return this.http.get(url);
  }
  public loadAllDates():Observable<any>{
    const url:string = this.model.config.serviceURL+'?action=periods';
    return this.http.get(url);
  }
}
