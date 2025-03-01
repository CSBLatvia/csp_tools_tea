import { NgModule } from '@angular/core';
import { AboutApiRoutingModule } from './about-api-routing.module';
import {AboutApiViewComponent} from "../view-about-api/about-api-view.component";
import {SharedUiModule} from "../mod-shared-ui/shared-ui.module";
import {SharedComponentsModule} from "../mod-shared-all/shared-components.module";
import {LoggerService} from "../model/log/logger.service";
import {StatsService} from "../model/services/stats/stats.service";
import {MetaUpdateService} from "../model/services/meta-update/meta-update.service";
import {RouteService} from "../model/services/route/route.service";
import {SettingsService} from "../model/services/settings/settings.service";
import {DomElementsInfo} from "../model/vo/DomElementsInfo";
import {WindowRefService} from "../model/services/window/window-ref.service";


@NgModule({
  declarations: [
    AboutApiViewComponent
  ],
    imports: [
        SharedUiModule,
        AboutApiRoutingModule,
        SharedComponentsModule
    ],
  providers:[
    SettingsService,StatsService, MetaUpdateService, LoggerService, RouteService,
    DomElementsInfo,WindowRefService
  ],
  exports:[AboutApiViewComponent]
})
export class AboutApiModule { }
