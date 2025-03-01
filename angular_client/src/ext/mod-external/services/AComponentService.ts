import {IComponentService} from "./IComponentService";
import {HttpClient} from "@angular/common/http";
import {EventEmitter} from "@angular/core";
import {ComponentServiceErrorVO} from "./ComponentServiceErrorVO";
import {IModel} from "../../../app/model/IModel";
import {ComponentServiceEmptyVO} from "./ComponentServiceEmptyVO";
import {RouteVO} from "../../../app/model/vo/RouteVO";


export class AComponentService implements IComponentService{

  public loaded:boolean;
  public data:any;
  public FUNCTION:string='';
  public route:RouteVO;
  public model:IModel;
  protected http:HttpClient;
  public onDataLoaded:EventEmitter<any> = new EventEmitter<any>();
  public error:ComponentServiceErrorVO = null;
  public empty:ComponentServiceEmptyVO = null;


  constructor() {
    this.loaded = false;
    this.data = null;
  }

  public loadData(route:RouteVO):void{
    this.data=null;
    const URL:string = this.model.config.serviceURL+'?db='+this.FUNCTION+'&lang='+route.lang+'&year='+route.year+'&m1='+route.M1+'&m2='+route.M2+'&m3='+route.M3+'&m4='+route.M4+'&t1='+route.T1+'&t2='+route.T2;
    this.http.get(URL).subscribe((data:any) => this.onLoaded({...data},route.lang));
  }

  protected onLoaded(data:any,lang:string = 'lv'):void{
    this.data = data;
    this.onDataLoaded.emit(data);
  }
}
