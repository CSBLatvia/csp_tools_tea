import { NgModule } from '@angular/core';
import { TerritoryRoutingModule } from './territory-routing.module';
import {SharedUiModule} from "../mod-shared-ui/shared-ui.module";
import {TerritoryViewComponent} from "../view-territory/territory-view.component";
import {TerritoryService} from "./services/territory.service";
import {BlockM1M2Component} from "../view-territory/components/block-m1-m2/block-m1-m2.component";
import {BlockT1T2YearComponent} from "../view-territory/components/block-t1-t2-year/block-t1-t2-year.component";
import {BlockT1InfoComponent} from "../view-territory/components/block-t1-info/block-t1-info.component";
import {BlockT1IndustryComponent} from "../view-territory/components/block-t1-industry/block-t1-industry.component";
import { BlockT1ProfessionComponent} from "../view-territory/components/block-t1-profession/block-t1-profession.component";
import {BlockT1SectorComponent} from "../view-territory/components/block-t1-sector/block-t1-sector.component";
import {BlockT1EconomicComponent} from "../view-territory/components/block-t1-economic/block-t1-economic.component";
import {StatsService} from "../model/services/stats/stats.service";
import {MetaUpdateService} from "../model/services/meta-update/meta-update.service";
import {LoggerService} from "../model/log/logger.service";
import {RouteService} from "../model/services/route/route.service";
import {SettingsService} from "../model/services/settings/settings.service";
import {DomElementsInfo} from "../model/vo/DomElementsInfo";
import {WindowRefService} from "../model/services/window/window-ref.service";
import {SharedComponentsModule} from "../mod-shared-all/shared-components.module";
import {BlockT1T2FlowComponent} from "../view-territory/components/block-t1-t2-flow/block-t1-t2-flow.component";
import {BlockT1T2InfoComponent} from "../view-territory/components/block-t1-t2-info/block-t1-t2-info.component";
import {MapTerritoryModule} from "../../ext/mod-external/modules/map-territory/map-territory.module";
import {PercentageListModule} from "../../ext/mod-external/modules/percentage-list/percentage-list.module";
import {PercentageBarModule} from "../../ext/mod-external/modules/percentage-bar/percentage-bar.module";
import {LinesChartModule} from "../../ext/mod-external/modules/lines-chart/lines-chart.module";
import {PieChartModule} from "../../ext/mod-external/modules/pie-chart/pie-chart.module";
import {FlowChartModule} from "../../ext/mod-external/modules/flow-chart/flow-chart.module";
import {BlockScatterT1T2LinksComponent} from "../view-territory/components/block-scatter-t1-t2-links/block-scatter-t1-t2-links.component";
import {BlockScatterT1LinksComponent} from "../view-territory/components/block-scatter-t1-links/block-scatter-t1-links.component";


@NgModule({
  declarations: [
    TerritoryViewComponent,
    BlockM1M2Component,
    BlockT1T2YearComponent,
    BlockT1InfoComponent,BlockT1T2InfoComponent,

    BlockT1IndustryComponent,
    BlockT1ProfessionComponent,
    BlockT1SectorComponent,
    BlockT1EconomicComponent,
    BlockT1T2FlowComponent,

    BlockScatterT1LinksComponent,
    BlockScatterT1T2LinksComponent,

  ],
    imports: [
        SharedUiModule,
        TerritoryRoutingModule,
        SharedComponentsModule,
        MapTerritoryModule,
        PercentageListModule,
        PercentageBarModule,
        LinesChartModule,
        PieChartModule,
        FlowChartModule
    ],
  providers:[
    TerritoryService,
    SettingsService,StatsService, MetaUpdateService, LoggerService, RouteService,
    DomElementsInfo,WindowRefService
  ],
  exports:[
    TerritoryViewComponent
  ]
})
export class TerritoryModule { }
