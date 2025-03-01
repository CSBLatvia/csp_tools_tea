import {Component} from '@angular/core';
import {TranslationVO} from "../../model/vo/TranslationVO";
import {ControlValueVO} from "../../ui-controls/vos/ControlValueVO";
import {AChooseUI} from "../../model/AChooseUI";
import {ModelService} from "../../model/model.service";

@Component({
  selector: 'app-choose-m4',
  templateUrl: './choose-m4.component.html',
  styleUrls: ['./choose-m4.component.scss']
})
export class ChooseM4Component extends AChooseUI {
  ///////////////////////////////////////////
  // M1 - place - work, home
  // M2 - added value, number-of-employees, value-produced-by-employees
  // M3 - industry, profesion, sector

  //  - mprofs:       https://tools.csb.gov.lv/tea/api?db=menu-profs
  //  - mnaces:       https://tools.csb.gov.lv/tea/api?db=menu-naces
  //  - msectors:     https://tools.csb.gov.lv/tea/api?db=menu-sector
  //  - territories:  https://tools.csb.gov.lv/tea/api?db=menu-territories&level=4
  //  - years:        https://tools.csb.gov.lv/tea/api?db=menu-years

  // M4 - chosen M3
  // T1 - territory one
  // T2 - territory two
  ///////////////////////////////
  public  m4:string = '';
  public  m4_label:TranslationVO;
  public  m4_data:Array<ControlValueVO>=[];

  override onComponentLanguageChanged():void {
    switch (this.route.M3){
      case 'i':
        this.m4_label = this.model.settings.m4_label_i;
        break;
      case 'p':
        this.m4_label = this.model.settings.m4_label_p;
        break;
      case 's':
        this.m4_label = this.model.settings.m4_label_s;
        break;
      default:
        this.m4_label = this.model.settings.m4_label;
        break;
    }
    this.m4_label.lang = this.lang;
    this.m4_data.forEach((item:ControlValueVO)=>{
      item.name.lang = this.model.translations.lang;
    });
  }
  override onComponentValuesChanged():void {
    this.route = this.model.getRoute();
    this.lang = this.route.lang;

    this.m4 = this.model.settings.m4;
    this.m4_data = this.model.settings.m4_data;
    switch (this.route.M3){
      case 'i':
        this.m4_label = this.model.settings.m4_label_i;
        break;
      case 'p':
        this.m4_label = this.model.settings.m4_label_p;
        break;
      case 's':
        this.m4_label = this.model.settings.m4_label_s;
        break;
      default:
        this.m4_label = this.model.settings.m4_label;
        break;
    }
  }
  override onChange(vo:ControlValueVO):void{
    this.model.settings.changeM4(vo);
  }
}
