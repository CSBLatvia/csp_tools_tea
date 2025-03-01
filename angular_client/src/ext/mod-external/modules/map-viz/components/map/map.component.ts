import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import {MiniModelService} from "../../../../../../app/model/minimodel.service";
import {DomElementsInfo} from "../../../../../../app/model/vo/DomElementsInfo";
import {RouteVO} from "../../../../../../app/model/vo/RouteVO";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit,OnChanges {

  @Input() route:RouteVO;
  @Input() lang:string;
  @Input() mobile:boolean;
  @Input() domID:string;

  public mapIsFullScreen:boolean;
  public legendIsVisible:boolean;
  @Input() initialized:boolean = false;

  public onDomUpdateListener:any;



  constructor(private model:MiniModelService, private dom:DomElementsInfo) {
    this.mobile = this.model.dom.isMobile;
    this.mapIsFullScreen = this.dom.mapIsFullScreen;
    this.legendIsVisible = this.dom.legendIsVisible;
  }

  ngOnInit():void {
    this.onDomUpdateListener = this.dom.onUpdate.subscribe(this.onDomElementsUpdate);
    this.onResize();
  }
  ngOnChanges(changes: SimpleChanges) {}

  private onDomElementsUpdate=():void=>{
    this.mapIsFullScreen = this.dom.mapIsFullScreen;
    this.legendIsVisible = this.dom.legendIsVisible;
    this.onResize();
  }
  public onResize=():void=>{
  }

}
