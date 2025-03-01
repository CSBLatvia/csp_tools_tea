import {EventEmitter, Injectable} from '@angular/core';
import {ControlValueVO} from "../../../../../ui-controls/vos/ControlValueVO";
import { TranslationVO } from 'src/app/model/vo/TranslationVO';
import {RouteVO} from "../../../../../../app/model/vo/RouteVO";
import {MapVizService} from "../../../../services/map-viz.service";

@Injectable()
export class MapLegendService {

  private service:MapVizService;
  private serviceURL:string = '';
  public initialized:boolean = false;
  private onModelReadyListener:any;
  //////////////////////////////////


  private route:RouteVO;

  public titleClustersVO:TranslationVO;
  public subtitleClustersVO:TranslationVO;

  public titleSizesVO:TranslationVO;
  public subtitleSizesVO:TranslationVO;

  public titleCirclesVO:TranslationVO;
  public subtitleCirclesVO:TranslationVO;

  public titleListVO:TranslationVO;
  public subtitleListVO:TranslationVO;


  public listData:Array<ControlValueVO>=[];


  public onDataUpdate:EventEmitter<any> = new EventEmitter<any>();
  public onSizesInfoUpdate:EventEmitter<any> = new EventEmitter<any>();

  //////////////////////////////////
  public valueTooSmallStartsFrom:number=-1;
  public valueMaxOnScreen:number=-1;
  public areaMaxOnScreen:number=-1;
  public minRadius:number=-1;


  constructor() {}

  public initialize(service:MapVizService):void{
    if(this.initialized===true){return;}
    this.service = service;
    this.onModelReadyListener = this.service.model.onModelReady.subscribe(this.onModelReady);
    if(this.service.model.READY===true){
      this.initializeService();
    }
  }
  public update(route:RouteVO):void{
    this.route = route;
    this.getLocalizations();
  }

  private initializeService():void {
    if(this.initialized===true){return;}
    this.initialized = true;
    this.serviceURL = this.service.model.config.serviceURL;
    this.route = this.service.model.getRoute();
    this.getLocalizations();
  }
  private onModelReady=():void=>{
    this.initializeService();
  }

  public destroy():void{ }
  private getLocalizations():void{

    let titleSTR:string = 'legend-clusters-title-'+this.route.M1+'-'+this.route.M2;
    let subtitleSTR:string = 'legend-clusters-subtitle-'+this.route.M1+'-'+this.route.M2;

    this.titleClustersVO = this.service.model.translations.item(titleSTR);
    this.subtitleClustersVO = this.service.model.translations.item(subtitleSTR);


    titleSTR = 'legend-circles-title-'+this.route.M1+'-'+this.route.M2;
    subtitleSTR = 'legend-circles-subtitle-'+this.route.M1+'-'+this.route.M2;

    this.titleCirclesVO = this.service.model.translations.item(titleSTR);
    this.subtitleCirclesVO = this.service.model.translations.item(subtitleSTR);

    titleSTR = 'legend-sizes-title-'+this.route.M1+'-'+this.route.M2;
    subtitleSTR = 'legend-sizes-subtitle-'+this.route.M1+'-'+this.route.M2;

    this.titleSizesVO = this.service.model.translations.item(titleSTR);
    this.subtitleSizesVO = this.service.model.translations.item(subtitleSTR);


    if(this.route.M3!=='none') {
      titleSTR = 'legend-list-title-' + this.route.M3;
      subtitleSTR = 'legend-list-subtitle-' + this.route.M3;

      this.titleListVO = this.service.model.translations.item(titleSTR);
      this.subtitleListVO = this.service.model.translations.item(subtitleSTR);

    }else{
      this.titleListVO = null;
      this.subtitleListVO = null;
    }
    this.onDataUpdate.emit('update');

  }

  public updateLegendSizes(valueTooSmallStartsFrom:number=-1,valueMaxOnScreen:number=-1,areaMaxOnScreen:number=-1, minRadius:number=-1){
    this.valueTooSmallStartsFrom = valueTooSmallStartsFrom;
    this.valueMaxOnScreen = valueMaxOnScreen;
    this.areaMaxOnScreen = areaMaxOnScreen;
    this.minRadius = minRadius;
    this.onSizesInfoUpdate.emit('update');
  }
  public updateLegendListData(listData:Array<ControlValueVO>):void{
      this.listData = listData;
      this.onDataUpdate.emit('update');
  }
}
