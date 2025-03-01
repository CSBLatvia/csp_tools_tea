import {EventEmitter, Injectable} from '@angular/core';
import {CentroidVO} from "../../vos/CentroidVO";
import {MapVizService} from "../../../../services/map-viz.service";


@Injectable()

export class MapCentroidsService {

  private service:MapVizService;
  public initialized:boolean = false;
  public onDataUpdated:EventEmitter<string> = new EventEmitter<string>();
  public onMapPositionUpdated:EventEmitter<string> = new EventEmitter<string>();

  public data:Array<CentroidVO> = [];
  public geoJsonFeatures:any=[];
  public ids:Array<string> = [];

  constructor() {}

  public initialize(service:MapVizService):void{
    this.onMapPositionUpdated = new EventEmitter<string>();
    this.service = service;
    this.initialized = true;
  }

  public parseData(data:Array<any>):void{
    this.data=[];
    this.ids=[];
    this.geoJsonFeatures = [];
    let vo:CentroidVO;
    data.forEach((item:any)=>{

      ////////////////////////
      vo = new CentroidVO(item.code,[parseFloat(item.lon+''),parseFloat(item.lat+'')]);
      this.data.push(vo);
      this.ids.push(item.code);

      ////////////////////////
      this.geoJsonFeatures.push(
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [parseFloat(item.lon+''), parseFloat(item.lat+'')]
          }
        }
      );
      ////////////////////////

    });
    this.dataHasBeenUpdated();
  }
  public mapPositionUpdate():void{
    this.onMapPositionUpdated.emit('update');
  }

  private dataHasBeenUpdated():void{
    this.onDataUpdated.emit('update');
  }
}
