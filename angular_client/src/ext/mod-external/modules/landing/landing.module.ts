import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import {CompLandingComponent} from "../../components/comp-landing/comp-landing.component";


@NgModule({
  declarations: [CompLandingComponent],
  imports: [
    CommonModule,
    LandingRoutingModule
  ],
  exports:[CompLandingComponent]
})
export class LandingModule { }
