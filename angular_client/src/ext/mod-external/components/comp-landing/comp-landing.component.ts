import {Component, ViewEncapsulation} from '@angular/core';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'ext-comp-landing',
  templateUrl: './comp-landing.component.html',
  styleUrls: ['./comp-landing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompLandingComponent {
  public HOST = environment.production==true?'https://tools.csb.gov.lv/tea_3/external':environment.externalComponentsURL;
}
