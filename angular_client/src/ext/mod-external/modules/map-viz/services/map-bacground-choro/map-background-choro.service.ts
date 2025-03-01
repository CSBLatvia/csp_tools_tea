import {EventEmitter, Injectable} from '@angular/core';
import {BackgroundDataVO} from "../../vos/BackgroundDataVO";
import {AllClustersVO} from "../../../../../model/vo/AllClustersVO";
import {MapVizService} from "../../../../services/map-viz.service";


@Injectable()
export class MapBackgroundChoroService {

  private service:MapVizService;
  public initialized:boolean = false;
  //////////////////////////////////

  public data:Array<BackgroundDataVO> = [];
  public ids:Array<string> = [];
  public clusters:AllClustersVO;
  public impossibleData:boolean = false;
  public zerroData:boolean = false;

  public onDataUpdated:EventEmitter<string>;


  constructor() {}
  public initialize(service:MapVizService):void{
    this.onDataUpdated = new EventEmitter<string>();
    this.service = service;
    this.initialized = true;
  }

  public setData(data:Array<any>,clusters:Array<any>):void{

    this.clusters = new AllClustersVO(clusters,this.service.model.config.mapColors.choroColors(this.service.model.route.M1));
    this.data=[];
    this.ids=[];

    this.impossibleData = false;

    this.data=[];
    this.ids=[];
    this.impossibleData = false;
    this.zerroData = false;

    let vo:BackgroundDataVO;
    data.forEach((item:any)=>{
      // if value isn't possible it must be -1
      if(item.type && item.type==='parent'){

      }else {
          vo = new BackgroundDataVO(item.code, item.choro == null ? -1 : item.choro as number);

          this.data.push(vo);
          this.ids.push(item.code);

          ///////////////////////////////
          this.clusters.addValue(vo.value);
          ///////////////////////////////

          if (vo.value === -1) {
            this.impossibleData = true;
          }
          if (vo.value === 0) {
            this.zerroData = true;
          }
      }

    });

    console.log('*****************');
    console.log('MapBackgroundChoroService - setData');
    console.dir(this.clusters);
    console.log('*****************');
    console.log('clusters count:'+this.clusters.items.length);
    console.log('zerroData: '+this.zerroData);
    console.log('impossibleData: '+this.impossibleData);
    console.log('*****************');

    this.dataHasBeenUpdated();
  }
  private dataHasBeenUpdated=():void=>{
    this.onDataUpdated.emit('update');
  }
}
