import { Component } from '@angular/core';
import {AComponent} from "../../../model/AComponent";


@Component({
  selector: 'app-comp-map-territory',
  templateUrl: './comp-map-territory.component.html',
  styleUrls: ['./comp-map-territory.component.scss']
})
export class CompMapTerritoryComponent extends AComponent{

  constructor() {
    super();
    this.logger.enabled = false;
  }

  override onChanges() {}
  private onDataLoaded=(data:any):void=>{
    this.informParentAboutSize();
    setTimeout(() => {
      this.informParentAboutSize();
    }, 10);
  }
  public onFullscreenChange(value:boolean):void{
    this.fullscreen = value;
    this.informAboutFullscreen();
  }
}
