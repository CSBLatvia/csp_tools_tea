import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ClarityModule, ClrIconModule} from '@clr/angular';
import {CommonModule} from '@angular/common';
import {TopMenuComponent} from '../components-shared-ui/top-menu/top-menu.component';
import {FooterComponent} from '../components-shared-ui/footer/footer.component';
import {ScriptService} from './services/script.service';
import {ScrollTopComponent} from '../components-shared-ui/scroll-top/scroll-top.component';
import {AriaEnabledDirective} from "../directives/aria-enabled.directive";
import {TrapFocusDirective} from "../directives/trap-focus.directive";
import {TopMenuDesktopComponent} from "../components-shared-ui/top-menu/components/top-menu-desktop/top-menu-desktop.component";
import {TopMenuMobileComponent} from "../components-shared-ui/top-menu/components/top-menu-mobile/top-menu-mobile.component";
import {TopMenuDesktopFullComponent} from "../components-shared-ui/top-menu/components/top-menu-desktop-full/top-menu-desktop-full.component";
import {FooterLargeComponent} from "../components-shared-ui/footer/footer-large/footer-large.component";
import {FooterTinyComponent} from "../components-shared-ui/footer/footer-tiny/footer-tiny.component";
import {NgScrollbarModule} from 'ngx-scrollbar';
import {DomChangeDirective} from "../directives/dom-change.directive";
import {SettingsMobile} from "../components-shared-ui/top-menu/components/top-menu-mobile/settings-mobile/settings-mobile";

import {ChooseM1Component} from "../components-shared-ui/choose-m1/choose-m1.component";
import {ChooseM1FatComponent} from "../components-shared-ui/choose-m1-fat/choose-m1-fat.component";
import {ChooseM2Component} from "../components-shared-ui/choose-m2/choose-m2.component";
import {ChooseM3Component} from "../components-shared-ui/choose-m3/choose-m3.component";
import {ChooseM4Component} from "../components-shared-ui/choose-m4/choose-m4.component";
import {ChooseT1Component} from "../components-shared-ui/choose-t1/choose-t1.component";
import {ChooseT2Component} from "../components-shared-ui/choose-t2/choose-t2.component";
import {ChooseT1FatComponent} from "../components-shared-ui/choose-t1-fat/choose-t1-fat.component";
import {UiControlsModule} from "../ui-controls/modules/ui-controls.module";
import {ChooseYearComponent} from "../components-shared-ui/choose-year/choose-year.component";
import {ChooseM2M2Component} from "../components-shared-ui/choose-m2-m2/choose-m2-m2.component";
import {AView} from "../model/AView";
import {ABlock} from "../model/ABlock";
import {SafePipe} from "../pipes/safe.pipe";
import {IframeDirective} from "../directives/iframe.directive";
import {SharedExternalCompModule} from "../../ext/mod-external/modules/shared-external-comp.module";





@NgModule({
    declarations: [
      TopMenuComponent,
      TopMenuDesktopComponent,TopMenuDesktopFullComponent, TopMenuMobileComponent, SettingsMobile,
      FooterComponent,FooterLargeComponent,FooterTinyComponent,

      ChooseM1Component, ChooseM1FatComponent,ChooseM2Component,ChooseM3Component,ChooseM4Component,ChooseT1Component,ChooseT1FatComponent, ChooseT2Component,
      ChooseYearComponent,ChooseM2M2Component,

      ScrollTopComponent,

      TrapFocusDirective,
      DomChangeDirective,
      AriaEnabledDirective,
      AView,ABlock,SafePipe,IframeDirective
    ],
    imports: [
        CommonModule,
        ClrIconModule,
        ClarityModule,
        NgScrollbarModule,
        RouterModule,
        UiControlsModule,
        SharedExternalCompModule,
        UiControlsModule
    ],
  exports: [
    CommonModule,
    ClrIconModule,
    ClarityModule,
    TopMenuComponent,
    TopMenuDesktopComponent, TopMenuDesktopFullComponent, TopMenuMobileComponent, SettingsMobile,
    FooterComponent, FooterLargeComponent, FooterTinyComponent,
    ScrollTopComponent,

    ChooseM1Component, ChooseM1FatComponent, ChooseM2Component, ChooseM3Component, ChooseM4Component, ChooseT1Component, ChooseT1FatComponent, ChooseT2Component,
    ChooseYearComponent, ChooseM2M2Component,

    AriaEnabledDirective,
    TrapFocusDirective,
    DomChangeDirective,
    AView, ABlock, SafePipe,IframeDirective
  ],
  providers:[ScriptService]
})
export class SharedUiModule { }
