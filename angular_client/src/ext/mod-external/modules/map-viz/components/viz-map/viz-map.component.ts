import {Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {CentroidVO} from '../../vos/CentroidVO';
import {MapVizService} from "../../../../services/map-viz.service";
import {RouteVO} from "../../../../../../app/model/vo/RouteVO";
import {IModel} from "../../../../../../app/model/IModel";


@Component({
  selector: 'app-viz-map',
  templateUrl: './viz-map.component.html',
  styleUrls: ['./viz-map.component.scss']
})
export class VizMapComponent implements OnInit,OnDestroy, OnChanges {


  @Input() model:IModel;
  @Input() route:RouteVO;

  @Input() ww:number = 1;
  @Input() hh:number = 1;
  public initialized:boolean = false;
  @Input() visible:boolean;


  public wwR:number = 1;
  public hhR:number = 1;


  public centroidData:Array<CentroidVO>=[];
  public MAP_SIZE:number=1;
  public strokeMin:number = 1;
  public strokeMax:number = 1;
  public radiusMin:number = 1;
  public radiusMax:number = 1;
  public dpi:number=-1;


  public visualization_type:number=1;         // 1-circles, 2-circles-region, 3-circles-sectors, 4-circles-sectors-region


  private onCentroidsMapPositionUpdateListener:any;
  private onModelReadyListener:any;
  private onModelMaxValuesReadyListener:any;


  constructor(public service:MapVizService) {}

  ngOnInit() {
    this.onCentroidsMapPositionUpdateListener = this.service.centroids.onMapPositionUpdated.subscribe(this.onMapPositionUpdate);
    this.onModelReadyListener = this.service.model.onModelReady.subscribe(this.onModelReady);

    this.route = this.service.route;
    this.centroidData = this.service.centroids.data;
    this.dpi = this.service.model.config.DPI;
    this.visualization_type = this.service.VIZ;

    this.checkReady();
  }
  ngOnDestroy(): void {
    this.onCentroidsMapPositionUpdateListener?.unsubscribe();
    this.onModelReadyListener?.unsubscribe();
    this.onModelMaxValuesReadyListener?.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes['route']){
      this.visualization_type = this.service.VIZ;
    }
    if(changes['ww'] || changes['hh']){
      this.resizeContainer();
    }
    if(changes['visible']){
      this.resizeContainer();
    }
  }

  private onModelReady=():void=>{
    if (this.initialized === true) {
      return;
    }
    this.checkReady();
  }
  initialize():void {
    if (this.initialized === true) { return; }

    this.strokeMin = 0;
    this.strokeMax = 0;
    this.radiusMin = 0;
    this.radiusMax = 0;

    this.route = this.service.route;
    this.centroidData = this.service.centroids.data;
    this.dpi = this.service.model.config.DPI;
    this.visualization_type = this.service.VIZ;
    this.initialized = true;

    this.resizeContainer();
  }

  private onMapPositionUpdate=():void=>{
    this.centroidData = [...this.service.centroids.data];
    this.MAP_SIZE = this.service.MAP_SIZE;
  }
  private checkReady():void{
    if(this.service.model.READY===true && this.initialized===false){
      this.initialize();
    }
  }

  private resizeContainer():void{
    this.dpi = this.service.model.config.DPI;
    this.wwR = this.ww*this.dpi;
    this.hhR = this.hh*this.dpi;
  }
}
