import { NgModule } from '@angular/core';

import { CompareRoutingModule } from './compare-routing.module';
import {SharedUiModule} from "../mod-shared-ui/shared-ui.module";
import {CompareViewComponent} from "../view-compare/compare-view.component";
import {CompareService} from "./services/compare.service";
import {BlockM1M3M4T1T2YearComponent} from "../view-compare/components/block-m1-m3-m4-t1-t2-year/block-m1-m3-m4-t1-t2-year.component";
import {BlockScatterplotComponent} from "../view-compare/components/block-scatterplot/block-scatterplot.component";
import {StatsService} from "../model/services/stats/stats.service";
import {MetaUpdateService} from "../model/services/meta-update/meta-update.service";
import {LoggerService} from "../model/log/logger.service";
import {RouteService} from "../model/services/route/route.service";
import {SettingsService} from "../model/services/settings/settings.service";
import {DomElementsInfo} from "../model/vo/DomElementsInfo";
import {WindowRefService} from "../model/services/window/window-ref.service";
import {SharedComponentsModule} from "../mod-shared-all/shared-components.module";
import {FlowChartModule} from "../../ext/mod-external/modules/flow-chart/flow-chart.module";
import {ScatterPlotModule} from "../../ext/mod-external/modules/scatter-plot/scatter-plot.module";


@NgModule({
  declarations: [
    CompareViewComponent,
    BlockM1M3M4T1T2YearComponent,
    BlockScatterplotComponent
  ],
  imports: [
    SharedUiModule,
    CompareRoutingModule,
    SharedComponentsModule,
    FlowChartModule,
    ScatterPlotModule
  ],
  providers:[
    CompareService,
    SettingsService,StatsService, MetaUpdateService, LoggerService, RouteService,
    DomElementsInfo,WindowRefService
  ],
  exports:[CompareViewComponent]
})
export class CompareModule { }
