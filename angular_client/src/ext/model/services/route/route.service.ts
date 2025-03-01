import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";
import {IModel} from "../../../../app/model/IModel";

@Injectable()

export class RouteService {

  public model:IModel;

  constructor(private http: HttpClient, private router:Router) {}

  public initialize(model:IModel){
    this.model = model;
  }

  public saveRouteURL=(url:string):void=>{
    if(this.model.READY===false){ return;}
    const route:string = (this.model.config.hostName+url).replace(/\//g, '^');
    this.http.post(this.model.config.serviceURL+'?db=route', JSON.stringify({route:route})).subscribe(response => {
       //console.dir(response);
    });
  }
}
