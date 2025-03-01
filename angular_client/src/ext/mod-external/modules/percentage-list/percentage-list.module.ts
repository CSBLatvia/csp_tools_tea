import { NgModule } from '@angular/core';
import { PercentageListRoutingModule } from './percentage-list-routing.module';
import {CompPercentageListComponent} from "../../components/comp-percentage-list/comp-percentage-list.component";
import {SharedExternalCompModule} from "../shared-external-comp.module";
import {ViewPercentageListComponent} from "../../views/view-percentage-list/view-percentage-list.component";


@NgModule({
  declarations: [
    CompPercentageListComponent,ViewPercentageListComponent
  ],
  imports: [
    SharedExternalCompModule,
    PercentageListRoutingModule
  ],
    exports: [
        ViewPercentageListComponent,
        CompPercentageListComponent
    ],
  providers:[]
})
export class PercentageListModule { }
