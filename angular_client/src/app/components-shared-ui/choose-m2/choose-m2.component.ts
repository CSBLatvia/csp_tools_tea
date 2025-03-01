import {Component} from '@angular/core';
import {ControlValueVO} from "../../ui-controls/vos/ControlValueVO";
import {TranslationVO} from "../../model/vo/TranslationVO";
import {AChooseUI} from "../../model/AChooseUI";
import {ModelService} from "../../model/model.service";

@Component({
  selector: 'app-choose-m2',
  templateUrl: './choose-m2.component.html',
  styleUrls: ['./choose-m2.component.scss']
})
export class ChooseM2Component extends AChooseUI {

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

  public  m2:string = '';
  public  m2_label:TranslationVO;
  public  m2_data:Array<ControlValueVO>=[];


  override onComponentLanguageChanged():void {
    this.m2_label = this.model.settings.m2_label;
  }

  override onComponentValuesChanged():void {
    this.route = this.model.getRoute();
    this.lang = this.route.lang;

    this.m2 = this.model.settings.m2;
    this.m2_data = this.model.settings.m2_data;
    this.m2_label = this.model.settings.m2_label;
  }
  override onChange(vo:ControlValueVO):void{
    this.model.settings.changeM2(vo);
  }

}
