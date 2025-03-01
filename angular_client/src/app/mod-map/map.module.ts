import { NgModule } from '@angular/core';
import { MapRoutingModule } from './map-routing.module';
import {SharedUiModule} from "../mod-shared-ui/shared-ui.module";
import {MapViewComponent} from "../view-map/map-view.component";
import {BlockM1M2M3M4T1T2Component} from "../view-map/components/block-m1-m2-m3-m4-t1-t2/block-m1-m2-m3-m4-t1-t2.component";
import {BlockMapComponent} from "../view-map/components/block-map/block-map.component";
import {StatsService} from "../model/services/stats/stats.service";
import {MetaUpdateService} from "../model/services/meta-update/meta-update.service";
import {LoggerService} from "../model/log/logger.service";
import {RouteService} from "../model/services/route/route.service";
import {SettingsService} from "../model/services/settings/settings.service";
import {DomElementsInfo} from "../model/vo/DomElementsInfo";
import {WindowRefService} from "../model/services/window/window-ref.service";
import {SharedComponentsModule} from "../mod-shared-all/shared-components.module";
import {MapVizModule} from "../../ext/mod-external/modules/map-viz/map-viz.module";


@NgModule({
  declarations: [
    MapViewComponent,
    BlockM1M2M3M4T1T2Component,
    BlockMapComponent
  ],
    imports: [
        SharedUiModule,
        MapRoutingModule,
        SharedComponentsModule,
        MapVizModule
    ],
  providers:[
    SettingsService,StatsService, MetaUpdateService, LoggerService, RouteService,
    DomElementsInfo,WindowRefService
  ],
  exports:[MapViewComponent]
})
export class MapModule { }
