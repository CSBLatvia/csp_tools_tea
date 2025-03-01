import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {CommonModule} from '@angular/common';
import {AppRoutingModule} from './app-routing.module';

import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {ModelService} from "./model/model.service";
import {StatsService} from "./model/services/stats/stats.service";
import {MetaUpdateService} from "./model/services/meta-update/meta-update.service";
import {LoggerService} from "./model/log/logger.service";
import {WindowRefService} from "./model/services/window/window-ref.service";
import {RouteService} from "./model/services/route/route.service";
import {DomElementsInfo} from "./model/vo/DomElementsInfo";
import {SettingsService} from "./model/services/settings/settings.service";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],

  providers: [ModelService, SettingsService, StatsService, MetaUpdateService, LoggerService, WindowRefService, RouteService, DomElementsInfo],
  bootstrap: [AppComponent]
})

export class AppModule{}
