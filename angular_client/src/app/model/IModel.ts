import {RegionNameVO} from "../../ext/model/vo/RegionNameVO";
import {Translations} from "./Translations";
import {Config} from "./Config";
import {EventEmitter} from "@angular/core";
import {ControlValueVO} from "../../ext/ui-controls/vos/ControlValueVO";
import {ScatterValueVO} from "../../ext/model/vo/ScatterValueVO";
import {DomElementsInfo} from "./vo/DomElementsInfo";
import {WindowRefService} from "../../ext/model/services/window/window-ref.service";
import {RouteVO} from "./vo/RouteVO";

export interface IModel{

  dom:DomElementsInfo;
  window:WindowRefService;
  translations:Translations;
  config:Config;
  READY:boolean;
  MOBILE_SIZE:number;

  route:RouteVO;
  years:Array<ControlValueVO>;

  regionNames:Array<RegionNameVO>;
  regionNames_ids:Array<string>;
  dataIsNotComplete:boolean;

  onDataUpdate:EventEmitter<string>;
  onLanguageUpdate:EventEmitter<string>;
  onRouteUpdate:EventEmitter<string>;
  onModelReady:EventEmitter<string>;
  onResizeUpdate:EventEmitter<string>;
  parentWinDomID:string;

  setRouteValues(route:RouteVO):void;
  M1_getRouteNameFromID(id:string):string;
  M2_getRouteNameFromID(m2_id:string,m1_id:string):string;
  M3_getRouteNameFromID(id:string):string;
  T1_getRouteNameFromID(id:string):string;
  getYearFromRoute(id:string):number;
  getRegionbyCode(code:string):RegionNameVO;
  getRoute():RouteVO;
  routeParamsNotValidError():void;
  ngOnDestroy():void;
}
