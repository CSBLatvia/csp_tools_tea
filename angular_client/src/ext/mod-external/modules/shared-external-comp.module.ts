import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClarityModule, ClrIconModule} from "@clr/angular";
import {NgScrollbarModule} from "ngx-scrollbar";
import {RouterModule} from "@angular/router";

import {SettingsService} from "../../model/services/settings/settings.service";
import {StatsService} from "../../model/services/stats/stats.service";
import {MetaUpdateService} from "../../model/services/meta-update/meta-update.service";
import {RouteService} from "../../model/services/route/route.service";
import {DomElementsInfo} from "../../../app/model/vo/DomElementsInfo";
import {WindowRefService} from "../../model/services/window/window-ref.service";
import {ShareButtonComponent} from "../components/share-button/share-button.component";
import {ServiceErrorComponent} from "../components/service-error/service-error.component";
import {ServiceEmptyComponent} from "../components/service-empty/service-empty.component";





@NgModule({
  declarations: [
    ShareButtonComponent,ServiceErrorComponent,ServiceEmptyComponent
  ],
  imports: [
    CommonModule,
    ClrIconModule,
    ClarityModule,
    NgScrollbarModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    ClrIconModule,
    ClarityModule,
    ShareButtonComponent,
    ServiceErrorComponent,
    ServiceEmptyComponent
  ],
  providers:[
    SettingsService,StatsService, MetaUpdateService, RouteService,
    DomElementsInfo,WindowRefService
  ]
})
export class SharedExternalCompModule { }
