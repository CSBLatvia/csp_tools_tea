import {Component} from '@angular/core';
import {PieChartService} from "../../services/pie-chart.service";
import {AComponent} from "../../../model/AComponent";

@Component({
  selector: 'app-comp-pie-chart',
  templateUrl: './comp-pie-chart.component.html',
  styleUrls: ['./comp-pie-chart.component.scss']
})
export class CompPieChartComponent extends AComponent {

  public color_IN:string = '#EE9824FF';
  public color_OUT:string = '#3376C4FF';
  public color_OFF:string = '#D3D3D3FF';
  public service:PieChartService;

  constructor() {
    super();
    this.service = new PieChartService();
  }
  override onInitialize() {
    this.service.model = this.model;
    this.service.onDataLoaded.subscribe(this.onDataLoaded);
    this.service.loadData(this.route);
  }
  override onChanges() {
    this.service.loadData(this.route);
  }

  private onDataLoaded=(data:any):void=>{
    this.informParentAboutSize();
    setTimeout(() => {
      this.informParentAboutSize();
    }, 10);
  }
}
