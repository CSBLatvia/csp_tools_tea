import {Component, inject} from '@angular/core';
import {IModel} from "../../../../app/model/IModel";
import {MiniModelService} from "../../../../app/model/minimodel.service";

@Component({
  selector: 'ext-view-map-viz',
  templateUrl: './view-map-viz.component.html'
})

export class ViewMapVizComponent {
  public model:IModel = inject(MiniModelService);
  constructor() {}
}
