import {Injectable} from '@angular/core';
import {VizCircleVO} from '../../vos/VizCircleVO';
import {IVizService} from './IVizService';
import {PickingColors} from "../../components/inc/PickingColors";
import {MapVizService} from "../../../../services/map-viz.service";
import {IModel} from "../../../../../../app/model/IModel";



@Injectable()
export class VizCirclesService implements IVizService{

  public parent:any;
  public data:Array<VizCircleVO> = [];
  public ids:Array<string> = [];
  public colors:Array<string> = [];

  private model:IModel;
  private service:MapVizService;

  constructor() {}

  public initialize(service:MapVizService):void{
    this.service = service;
    this.model = this.service.model;
  }

  public parseData(obj:any):void{
    console.log('***********************');
    console.log('VIZ-CIRCLES - parseData');
    let ob:any = {};
    const data:Array<any> = obj.map_set.map_data==null?[]:obj.map_set.map_data;
    const clusters:Array<any> = obj.map_set.clusters==null?[]:obj.map_set.clusters;

    console.log('data:')
    console.dir(data);
    console.log('clusters:')
    console.dir(clusters);
    console.log('***********************');

    /* TODO */
    this.service.dataIsNotComplete = data.length===0 || clusters.length===0;
    this.service.background.setData(data, clusters);

    console.log('***********************');
    console.log(' dataIsNotComplete:'+this.service.dataIsNotComplete);
    console.log('*********************');


    this.data=[];
    this.ids=[];
    this.colors=[];

    let vo:VizCircleVO;
    const picking:PickingColors = new PickingColors();
    let max:number = -1;

    data.forEach((item:any)=>{
      // code: "LV0010000", value_total: 17442259726.03, choro: 37129.52}
      if(item.value_total!==null && parseInt(item.value_total)>0){
        vo = new VizCircleVO(item.code,parseFloat(item.value_total+''),parseFloat(item.choro+''));
        vo.picking_color = picking.color();
        this.data.push(vo);
        this.ids.push(item.code);
        this.colors.push(vo.picking_color);
        max = Math.max(max,vo.value_area);
      }
    });
    //////////////////
    let j:number=0;
    const K:number = this.data.length;
    while(j<K){
      vo = this.data[j];
      vo.percentageFromData = (vo.value_area)*100/(max);
      j++;
    }
  }
  public getValueObjectByColor(color:string):VizCircleVO{
    const index:number = this.colors.indexOf(color);
    if(index!==-1){
      return this.data[index];
    }else{
      return null;
    }
  }
  public getValueObjectByRegionCode(code:string):VizCircleVO{
    const index:number = this.ids.indexOf(code);
    if(index!==-1){
      return this.data[index];
    }else{
      return null;
    }
  }
}
