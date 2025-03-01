import {Injectable} from '@angular/core';
import {VizCircleSectorVO} from '../../vos/VizCircleSectorVO';
import {PickingColors} from '../../components/inc/PickingColors';
import {IVizService} from './IVizService';
import {MapVizService} from "../../../../services/map-viz.service";
import {IModel} from "../../../../../../app/model/IModel";


@Injectable()
export class VizCirclesSectorsService  implements IVizService {



  public parent:any;
  public data:Array<VizCircleSectorVO> = [];
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
    console.log('VIZ-CIRCLES-SECTORS - parseData');

    const data:Array<any> = obj.map_set.map_data==null?[]:obj.map_set.map_data;
    const sector_meta:Array<any> = obj.map_set.sector_meta==null?[]:obj.map_set.sector_meta;
    const clusters:Array<any> = obj.map_set.clusters==null?[]:obj.map_set.clusters;

    console.log('data:')
    console.dir(data);
    console.log('clusters:')
    console.dir(clusters);
    console.log('***********************');

    /* TODO */
    this.service.dataIsNotComplete = data.length===0 || sector_meta.length===0 || clusters.length===0;
    this.service.background.setData(data, clusters);

    console.log('***********************');
    console.log(' dataIsNotComplete:'+this.service.dataIsNotComplete);
    console.log('*********************');


    this.model.config.colorCategories.generatePropertyColors(sector_meta);
    this.service.updateLegendListData(this.model.config.colorCategories);

    ///////////////////
    this.data=[];
    this.ids=[];
    let vo:VizCircleSectorVO;
    ///////////////////
    const picking:PickingColors = new PickingColors();
    let max:number = -1;
    let color: string;

    data.forEach((item:any)=>{

      /*
      code	"LV0980290"
      property_id	"G17"
      display_property_id	"other"
      value	1907790.45
      value_total	7596882.58
      choro	47694.76
      */

      if(item.value!==null && parseInt(item.value)>0){
          const property_id:string = item.display_property_id;
          color = this.model.config.colorCategories.getColorByProperty(property_id);
          vo = new VizCircleSectorVO(item.code,parseFloat(item.value+''),parseFloat(item.value_total+''), parseFloat(item.choro+''), property_id,false);
          vo.property_color = color;
          vo.picking_color = picking.color();

          this.data.push(vo);
          this.ids.push(item.code);
          this.colors.push(vo.picking_color);
          max = Math.max(max,vo.value_total);
      }
    });
    //////////////////
    let j:number=0;
    const K:number = this.data.length;
    while(j<K){
      vo = this.data[j];
      vo.percentageFromData = (vo.value_total)*100/(max);
      j++;
    }
    //////////////////
  }

  public getValueObjectByColor(color:string):VizCircleSectorVO{
    const index:number = this.colors.indexOf(color);
    if(index!==-1){
      return this.data[index];
    }else{
      return null;
    }
  }
  public getValueObjectByRegionCode(code:string):VizCircleSectorVO{
    const index:number = this.ids.indexOf(code);
    if(index!==-1){
      return this.data[index];
    }else{
      return null;
    }
  }
}
