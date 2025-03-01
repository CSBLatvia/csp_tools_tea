import { NgModule } from '@angular/core';
import { FlowChartRoutingModule } from './flow-chart-routing.module';
import {CompFlowChartComponent} from "../../components/comp-flow-chart/comp-flow-chart.component";
import {FlowChartService} from "../../services/flow-chart.service";
import {SharedExternalCompModule} from "../shared-external-comp.module";
import {ViewFlowChartComponent} from "../../views/view-flow-chart/view-flow-chart.component";
import {MapTerritoryModule} from "../map-territory/map-territory.module";



@NgModule({
  declarations: [
    CompFlowChartComponent,
    ViewFlowChartComponent
  ],
    imports: [
        SharedExternalCompModule,
        FlowChartRoutingModule,
        MapTerritoryModule
    ],
    exports: [
        ViewFlowChartComponent,
        CompFlowChartComponent
    ],
  providers:[]
})
export class FlowChartModule { }
