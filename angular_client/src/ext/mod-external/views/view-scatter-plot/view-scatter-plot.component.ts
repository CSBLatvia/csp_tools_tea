import {Component, inject} from '@angular/core';
import {IModel} from "../../../../app/model/IModel";
import {MiniModelService} from "../../../../app/model/minimodel.service";

@Component({
  selector: 'ext-view-scatter-plot',
  templateUrl: './view-scatter-plot.component.html'
})
export class ViewScatterPlotComponent {
  protected model:IModel = inject(MiniModelService);
  constructor() {}
}

