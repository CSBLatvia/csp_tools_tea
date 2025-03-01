import { Component } from '@angular/core';
import {PercentageListService} from "../../services/percentage-list.service";
import {AComponent} from "../../../model/AComponent";

@Component({
  selector: 'app-comp-percentage-list',
  templateUrl: './comp-percentage-list.component.html',
  styleUrls: ['./comp-percentage-list.component.scss']
})

//profesijas(i),nozares(p)
//  SELECT tea_dev.a_generate_percentage_list('lv', 2020, 'w', 'e', 'i', 'none', 3, 'all');
// http://localhost:4201/lv/ext-percentage-list/2020/workplace/number-of-workplaces/territories-3/all/industry/none

//  SELECT tea_dev.a_generate_percentage_list('lv', 2020, 'w', 'av', 'i', 'none', 3, 'all');
// http://localhost:4200/lv/ext-percentage-list/2020/workplace/added-value/territories-3/all/industry/none

//  SELECT tea_dev.a_generate_percentage_list('lv', 2020, 'w', 'vp', 'i', 'none', 3, 'all');
// http://localhost:4200/lv/ext-percentage-list/2020/workplace/value-produced/territories-3/all/industry/none


export class CompPercentageListComponent extends AComponent {

  public service:PercentageListService;

  constructor() {
    super();
    this.logger.log('COMP-PERCENTAGE-LIST - constr()');
    this.service = new PercentageListService();
  }
  override onChanges() {

    this.logger.log('COMP-PERCENTAGE-LIST - onChanges()');
    this.logger.dir(this.route);

    this.service.loadData(this.route);
  }
  override onInitialize() {

    this.logger.log('COMP-PERCENTAGE-LIST - onInitialize()');
    this.logger.dir(this.route);

    this.service.model = this.model;
    this.service.onDataLoaded.subscribe(this.onDataLoaded);
    this.service.loadData(this.route);
  }

  private onDataLoaded=(data:any):void=>{
    this.informParentAboutSize();
    setTimeout(() => {
      this.informParentAboutSize();
    }, 10);
  }

  public onTabClick(id:number):void{
    this.service.id = id;
    this.informParentAboutSize();
    setTimeout(() => {
      this.informParentAboutSize();
    }, 10);
  }
}
