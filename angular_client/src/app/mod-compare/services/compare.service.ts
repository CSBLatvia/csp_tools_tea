import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ModelService} from "../../model/model.service";
import {RouteVO} from "../../model/vo/RouteVO";
import {Observable} from "rxjs";

@Injectable()
export class CompareService {

  constructor(private http: HttpClient,private model:ModelService) { }
  public loadCompareAxisData(route:RouteVO):Observable<any>{
    const URL:string = this.model.config.serviceURL+'?db=menu-scatter-values';
    return this.http.get(URL);
  }
}
