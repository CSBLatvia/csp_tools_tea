import {Component} from '@angular/core';
import {TranslationVO} from "../../model/vo/TranslationVO";
import {ControlValueVO} from "../../ui-controls/vos/ControlValueVO";
import {AChooseUI} from "../../model/AChooseUI";
import {ModelService} from "../../model/model.service";

@Component({
  selector: 'app-choose-t1',
  templateUrl: './choose-t1.component.html',
  styleUrls: ['./choose-t1.component.scss']
})
export class ChooseT1Component extends AChooseUI {

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

  public  t1:string = '';
  public  t1_label:TranslationVO;
  public  t1_data:Array<ControlValueVO>=[];


  override onComponentLanguageChanged():void {
    this.t1_label = this.model.settings.t1_label;
    this.t1_data.forEach((item:ControlValueVO)=>{
      item.name.lang = this.model.translations.lang;
    });
  }
  override onComponentValuesChanged():void {
    this.route = this.model.getRoute();
    this.lang = this.route.lang;

    this.t1 = this.model.settings.t1;
    this.t1_data = this.model.settings.t1_data;
    this.t1_label = this.model.settings.t1_label;
  }
  override onChange(vo:ControlValueVO):void{
    this.model.settings.changeT1(vo);
  }

}
