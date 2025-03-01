import {MapVizService} from "../../../../services/map-viz.service";

export interface IVizService {

  parent:any;
  data:Array<any>;
  ids:Array<string>;
  colors:Array<string>;

  initialize(service:MapVizService);
  getValueObjectByRegionCode(code:string):any;
  getValueObjectByColor(color:string):any;
  getValueObjectByRegionCode(code:string):any;
  parseData(obj:any):void;
}
