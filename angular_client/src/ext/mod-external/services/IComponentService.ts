import {EventEmitter} from "@angular/core";
import {IModel} from "../../../app/model/IModel";
import {ComponentServiceErrorVO} from "./ComponentServiceErrorVO";
import {ComponentServiceEmptyVO} from "./ComponentServiceEmptyVO";
import {RouteVO} from "../../../app/model/vo/RouteVO";

export interface IComponentService {

  loaded:boolean;
  data:any;
  FUNCTION:string;
  model:IModel;
  route:RouteVO;
  onDataLoaded:EventEmitter<any>;
  error:ComponentServiceErrorVO;
  empty:ComponentServiceEmptyVO;

  loadData(route:RouteVO):void;
}
