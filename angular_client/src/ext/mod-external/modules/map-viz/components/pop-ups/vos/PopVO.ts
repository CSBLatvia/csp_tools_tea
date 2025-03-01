import {MapVizService} from "../../../../../services/map-viz.service";
import {RouteVO} from "../../../../../../../app/model/vo/RouteVO";
import {TranslationVO} from "../../../../../../../app/model/vo/TranslationVO";


export class PopVO{

  public route:RouteVO;
  public code:string;
  public title:TranslationVO;
  public textHTMLValue:string='';

  constructor(service:MapVizService, code:string){
    this.route = service.route;
    this.title = service.getRegionbyCode(code).name;
    this.title.lang = this.route.lang;
    this.code = code;
  }

  public update(value:string):void{
    this.textHTMLValue = value;
  }
}
