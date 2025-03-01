import {IComponentService} from "../../../../../services/IComponentService";
import {TranslationVO} from "../../../../../../../app/model/vo/TranslationVO";


export class PopSimpleVO{


  public title:TranslationVO;
  public code:string;

  constructor(service:IComponentService, code:string){
    this.code = code;
    let region = (service as any).getRegionbyCode(code);
    this.title = region.name;
    this.title.lang = service.route.lang;
  }
}
