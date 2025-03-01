import {Component, inject} from '@angular/core';
import {IModel} from "../../../../app/model/IModel";
import {MiniModelService} from "../../../../app/model/minimodel.service";

@Component({
  selector: 'ext-view-percentage-bar',
  templateUrl: './view-percentage-bar.component.html'
})
export class ViewPercentageBarComponent {

  protected model:IModel = inject(MiniModelService);

  constructor() {}
}
