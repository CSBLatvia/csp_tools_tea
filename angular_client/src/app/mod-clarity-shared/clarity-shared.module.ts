import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClarityModule, ClrIconModule} from '@clr/angular';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClrIconModule,
    ClarityModule
  ],
  exports:[
    CommonModule,
    ClrIconModule,
    ClarityModule
  ]
})
export class ClaritySharedModule { }
