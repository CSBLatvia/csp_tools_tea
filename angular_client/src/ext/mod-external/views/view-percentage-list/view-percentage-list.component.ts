import {Component, inject} from '@angular/core';
import {IModel} from "../../../../app/model/IModel";
import {MiniModelService} from "../../../../app/model/minimodel.service";

@Component({
  selector: 'ext-view-percentage-list',
  templateUrl: './view-percentage-list.component.html'
})

export class ViewPercentageListComponent {
  protected model:IModel = inject(MiniModelService);
  constructor() {}
}
