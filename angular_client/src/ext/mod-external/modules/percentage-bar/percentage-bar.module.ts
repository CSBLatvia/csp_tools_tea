import { NgModule } from '@angular/core';
import { PercentageBarRoutingModule } from './percentage-bar-routing.module';
import {CompPercentageBarComponent} from "../../components/comp-percentage-bar/comp-percentage-bar.component";
import {SharedExternalCompModule} from "../shared-external-comp.module";
import {ViewPercentageBarComponent} from "../../views/view-percentage-bar/view-percentage-bar.component";
import {FlowChartModule} from "../flow-chart/flow-chart.module";



@NgModule({
  declarations: [
    CompPercentageBarComponent,ViewPercentageBarComponent
  ],
    imports: [
        SharedExternalCompModule,
        PercentageBarRoutingModule,
        FlowChartModule
    ],
    exports: [
        ViewPercentageBarComponent,
        CompPercentageBarComponent
    ],
  providers:[]
})
export class PercentageBarModule { }

