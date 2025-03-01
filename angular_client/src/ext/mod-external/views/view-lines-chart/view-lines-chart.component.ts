import {Component, inject} from '@angular/core';
import {IModel} from "../../../../app/model/IModel";
import {MiniModelService} from "../../../../app/model/minimodel.service";

@Component({
  selector: 'ext-view-lines-chart',
  templateUrl: './view-lines-chart.component.html'
})
export class ViewLinesChartComponent {

  public model:IModel = inject(MiniModelService);

  constructor() {}

}
