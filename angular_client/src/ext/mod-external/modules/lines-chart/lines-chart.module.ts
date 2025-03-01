import { NgModule } from '@angular/core';
import { LinesChartRoutingModule } from './lines-chart-routing.module';
import {CompLinesChartComponent} from "../../components/comp-lines-chart/comp-lines-chart.component";
import {SharedExternalCompModule} from "../shared-external-comp.module";
import {ViewLinesChartComponent} from "../../views/view-lines-chart/view-lines-chart.component";
import {FlowChartModule} from "../flow-chart/flow-chart.module";



@NgModule({
  declarations: [
    CompLinesChartComponent,
    ViewLinesChartComponent
  ],
    imports: [
        SharedExternalCompModule,
        LinesChartRoutingModule,
        FlowChartModule
    ],
    exports: [
        ViewLinesChartComponent,
        CompLinesChartComponent
    ],
  providers:[]
})
export class LinesChartModule { }
