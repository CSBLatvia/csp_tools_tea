import {Component, inject} from '@angular/core';
import {IModel} from "../../../../app/model/IModel";
import {MiniModelService} from "../../../../app/model/minimodel.service";

@Component({
  selector: 'ext-view-flow-chart',
  templateUrl: './view-flow-chart.component.html'
})
export class ViewFlowChartComponent {

  public model:IModel = inject(MiniModelService);
  constructor() {}

}
