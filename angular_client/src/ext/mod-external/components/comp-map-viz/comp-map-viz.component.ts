import {
  Component,
  OnInit,
} from '@angular/core';
import {MapVizService} from "../../services/map-viz.service";
import {AComponent} from "../../../model/AComponent";

@Component({
  selector: 'app-comp-map-viz',
  templateUrl: './comp-map-viz.component.html',
  styleUrls: ['./comp-map-viz.component.scss']
})
export class CompMapVizComponent extends AComponent implements OnInit{

  constructor(public service:MapVizService) {
    super();
  }
  override onInitialize(){
     this.service.model = this.model;
     this.service.initialize(this.route);
  }
  public onFullscreenChange(value:boolean):void{
      this.fullscreen = value;
      this.informAboutFullscreen();
  }

}
