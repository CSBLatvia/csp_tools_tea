import {Component, inject} from '@angular/core';
import {IModel} from "../../../../app/model/IModel";
import {MiniModelService} from "../../../../app/model/minimodel.service";

@Component({
  selector: 'ext-view-map-territory',
  templateUrl: './view-map-territory.component.html'
})

export class ViewMapTerritoryComponent {

  public model:IModel = inject(MiniModelService);
  constructor() {}
}
