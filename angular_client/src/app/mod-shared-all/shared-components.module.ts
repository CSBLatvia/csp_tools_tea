import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClarityModule, ClrIconModule, ClrRadioModule} from '@clr/angular';
import {RouterModule} from '@angular/router';
import {BigTitleComponent} from '../components-shared-all/big-title/big-title.component';
import {FormsModule} from '@angular/forms';
import {SharedUiModule} from "../mod-shared-ui/shared-ui.module";
import {UiRadioGroupComponent} from "../components-shared-all/ui-radio-group/ui-radio-group.component";
import {NgxSliderModule} from "ngx-slider-v2";


@NgModule({
  declarations: [
    UiRadioGroupComponent,
    BigTitleComponent
  ],
    imports: [
        CommonModule,
        ClrIconModule,
        ClarityModule,
        FormsModule,
        ClrRadioModule,
        RouterModule,
        SharedUiModule,
        NgxSliderModule
    ],
  exports:[
    UiRadioGroupComponent,
    BigTitleComponent
  ]
})
export class SharedComponentsModule { }
