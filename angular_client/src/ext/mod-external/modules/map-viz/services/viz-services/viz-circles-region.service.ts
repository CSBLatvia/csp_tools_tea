import {Injectable} from '@angular/core';
import {VizCircleVO} from '../../vos/VizCircleVO';
import {PickingColors} from '../../components/inc/PickingColors';
import {IVizService} from './IVizService';
import {MapVizService} from "../../../../services/map-viz.service";
import {IModel} from "../../../../../../app/model/IModel";




@Injectable()
export class VizCirclesRegionService implements IVizService {

  public parent:VizCircleVO = null;
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

    const data:Array<any> = obj.map_set.map_data==null?[]:obj.map_set.map_data;
    const clusters:Array<any> = obj.map_set.clusters==null?[]:obj.map_set.clusters;

    /* TODO */
    this.service.dataIsNotComplete = data.length===0 || clusters.length===0;
    this.service.background.setData(data, clusters);


    this.data=[];
    this.ids=[];
    let vo:VizCircleVO;
    ///////////////////
    const picking:PickingColors = new PickingColors();
    let max:number = -1;

    data.forEach((item:any)=>{
      // code: "LV0010000", value_total: 17442259726.03, choro: 37129.52, type:"flow/parent"}
      if(item.type==='flow'){
        if(item.value_total!==null && parseInt(item.value_total)>0 && this.ids.indexOf(item.code)===-1){
          vo = new VizCircleVO(item.code, parseFloat(item.value_total + ''),parseFloat(item.choro + ''),false);
          vo.picking_color = picking.color();
          this.data.push(vo);
          this.ids.push(item.code);
          this.colors.push(vo.picking_color);
          max = Math.max(max,vo.value_area);
        }
      }else if(item.type==='parent'){
        this.parent = new VizCircleVO(item.code, parseFloat(item.value_total + ''),parseFloat(item.choro + ''), true);
        vo = new VizCircleVO('parent-'+item.code, parseFloat(item.value_total + ''),parseFloat(item.choro + ''), true);
        vo.picking_color = picking.color();
        this.data.push(vo);
        this.ids.push(vo.code);
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
    //////////////////
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
