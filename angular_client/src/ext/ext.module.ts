import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ExtRoutingModule } from './ext-routing.module';
import { ExtComponent } from './ext.component';
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {ClarityModule, ClrIconModule} from "@clr/angular";
import {MiniModelService} from "../app/model/minimodel.service";
import {StatsService} from "../app/model/services/stats/stats.service";
import {MetaUpdateService} from "../app/model/services/meta-update/meta-update.service";
import {WindowRefService} from "../app/model/services/window/window-ref.service";
import {RouteService} from "../app/model/services/route/route.service";
import {DomElementsInfo} from "../app/model/vo/DomElementsInfo";
import {LoggerService} from "../app/model/log/logger.service";


@NgModule({
  declarations: [
    ExtComponent
  ],
  imports: [
    CommonModule,
    ClrIconModule,
    ClarityModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ExtRoutingModule
  ],
  providers: [MiniModelService,StatsService,MetaUpdateService,WindowRefService,RouteService,DomElementsInfo, LoggerService],
  bootstrap: [ExtComponent]
})
export class ExtModule { }
