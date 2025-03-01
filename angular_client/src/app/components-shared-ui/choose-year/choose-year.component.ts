import {Component} from '@angular/core';
import {TranslationVO} from "../../model/vo/TranslationVO";
import {ControlValueVO} from "../../ui-controls/vos/ControlValueVO";
import {AChooseUI} from "../../model/AChooseUI";
import {ModelService} from "../../model/model.service";

@Component({
  selector: 'app-choose-year',
  templateUrl: './choose-year.component.html',
  styleUrls: ['./choose-year.component.scss']
})
export class ChooseYearComponent extends AChooseUI {
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

  public  y:string = '';
  public  y_label:TranslationVO;
  public  y_data:Array<ControlValueVO>=[];



  override onComponentLanguageChanged():void {
    this.y_label = this.model.settings.y_label;
  }
  override onComponentValuesChanged():void {
    this.route = this.model.getRoute();
    this.lang = this.route.lang;

    this.y = this.model.settings.y;
    this.y_data = this.model.settings.y_data;
    this.y_label = this.model.settings.y_label;
  }
  override onChange(vo:ControlValueVO):void{
    this.model.settings.changeYear(vo);
  }
}
