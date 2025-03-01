import {Component} from '@angular/core';
import {TranslationVO} from "../../model/vo/TranslationVO";
import {ControlValueVO} from "../../ui-controls/vos/ControlValueVO";
import {AChooseUI} from "../../model/AChooseUI";
import {ModelService} from "../../model/model.service";

@Component({
  selector: 'app-choose-m1',
  templateUrl: './choose-m1.component.html',
  styleUrls: ['./choose-m1.component.scss']
})
export class ChooseM1Component extends AChooseUI {

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
  public  m1:string = '';
  public  m1_label:TranslationVO;
  public  m1_data:Array<ControlValueVO>=[];

  ///////////////////////////////////////////////
  override onComponentLanguageChanged():void {
    this.m1_label = this.model.settings.m1_label;
  }

  override onComponentValuesChanged():void {
    this.route = this.model.getRoute();
    this.lang = this.route.lang;

    this.m1 = this.model.settings.m1;
    this.m1_data = this.model.settings.m1_data;
    this.m1_label = this.model.settings.m1_label;
  }
  override onChange(vo:ControlValueVO):void{
    this.model.settings.changeM1(vo);
  }
}
