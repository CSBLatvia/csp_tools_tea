import {Component, inject} from '@angular/core';
import {IModel} from "../../../../app/model/IModel";
import {MiniModelService} from "../../../../app/model/minimodel.service";

@Component({
  selector: 'ext-view-pie-chart',
  templateUrl: './view-pie-chart.component.html'
})
export class ViewPieChartComponent {
  protected model:IModel = inject(MiniModelService);
  constructor() {}
}
