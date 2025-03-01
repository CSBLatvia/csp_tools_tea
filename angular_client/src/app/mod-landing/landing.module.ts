import {NgModule} from '@angular/core';
import {LandingViewComponent} from '../view-landing/landing-view.component';
import {LandingRoutingModule} from './landing-routing.module';
import {SharedUiModule} from '../mod-shared-ui/shared-ui.module';
import {LandingService} from './services/landing.service';
import {BlockT1T2Component} from "../view-landing/components/block-t1-t2/block-t1-t2.component";
import {BlockM1YearComponent} from "../view-landing/components/block-m1-year/block-m1-year.component";
import {BlockT1InfoComponent} from "../view-landing/components/block-t1-info/block-t1-info.component";
import {BlockM1T1LinksComponent} from "../view-landing/components/block-m1-t1-links/block-m1-t1-links.component";
import {BlockM1T1T2LinksComponent} from "../view-landing/components/block-m1-t1-t2-links/block-m1-t1-t2-links.component";
import {BlockT1T2InfoComponent} from "../view-landing/components/block-t1-t2-info/block-t1-t2-info.component";
import {StatsService} from "../model/services/stats/stats.service";
import {MetaUpdateService} from "../model/services/meta-update/meta-update.service";
import {LoggerService} from "../model/log/logger.service";
import {RouteService} from "../model/services/route/route.service";
import {SettingsService} from "../model/services/settings/settings.service";
import {DomElementsInfo} from "../model/vo/DomElementsInfo";
import {WindowRefService} from "../model/services/window/window-ref.service";
import {SharedComponentsModule} from "../mod-shared-all/shared-components.module";
import {MapTerritoryModule} from "../../ext/mod-external/modules/map-territory/map-territory.module";

@NgModule({
  declarations: [
    LandingViewComponent,
    BlockT1T2Component,
    BlockM1YearComponent,
    BlockT1InfoComponent,
    BlockT1T2InfoComponent,
    BlockM1T1LinksComponent,
    BlockM1T1T2LinksComponent
  ],
    imports: [
        SharedUiModule,
        LandingRoutingModule,
        SharedComponentsModule,
        MapTerritoryModule
    ],
  providers:[
    LandingService,
    SettingsService,StatsService, MetaUpdateService, LoggerService, RouteService,
    DomElementsInfo,WindowRefService
  ],
    exports: [LandingViewComponent, BlockT1T2InfoComponent]
})
export class LandingModule { }

