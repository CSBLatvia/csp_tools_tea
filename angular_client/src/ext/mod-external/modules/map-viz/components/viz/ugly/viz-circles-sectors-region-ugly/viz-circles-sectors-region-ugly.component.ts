import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {VizPickingComponent} from '../../../viz-picking/viz-picking.component';
import {PopCirclesComponent} from '../../../pop-ups/pop-circles/pop-circles.component';


import {CentroidVO} from "../../../../vos/CentroidVO";
import {VizCircleSectorVO} from "../../../../vos/VizCircleSectorVO";
import {VizCirclesSectorsRegionService} from "../../../../services/viz-services/viz-circles-sectors-region.service";
import {MapPopService} from "../../../../services/map-pop/map-pop.service";
import {MapVizService} from "../../../../../../services/map-viz.service";

import {ConfigVizUgly} from "../../../../../../../model/configs/ConfigVizUgly";
import {Utils} from "../../../../../../../../app/model/inc/Utils";
import {RouteVO} from "../../../../../../../../app/model/vo/RouteVO";
import {IModel} from "../../../../../../../../app/model/IModel";

@Component({
  selector: 'viz-circles-sectors-region-ugly',
  templateUrl: './viz-circles-sectors-region-ugly.component.html',
  styleUrls: ['../../../viz-styles/viz-component.scss']
})
export class VizCirclesSectorsRegionUglyComponent implements OnInit,OnChanges, OnDestroy {


  @Input() mobile:boolean=false;

  private container:HTMLElement;
  private canvas:HTMLCanvasElement;
  private canvasCTX:CanvasRenderingContext2D;

  @ViewChild('canvasRef', { read: ViewContainerRef, static: true }) canvasRef:ViewContainerRef;
  @ViewChild('vizPickingRef', { read: VizPickingComponent, static: false }) vizPicking: VizPickingComponent;

  //////////////////////
  @ViewChild('popRef', { read: PopCirclesComponent, static: false }) pop: PopCirclesComponent;
  //////////////////////

  @Input() ww:number=5000;
  @Input() hh:number=5000;
  public wwR:number=-1;
  public hhR:number=-1;


  @Input() model:IModel;
  @Input() route:RouteVO;
  @Input() centroids:Array<CentroidVO>=[];
  @Input() initialized:boolean = false;
  @Input() visible:boolean;
  @Input() moving:boolean = false;
  @Input() dpi:number=1;

  private ready:boolean = false;
  private data:Array<VizCircleSectorVO>=[];
  private ids:Array<string>=[];
  ////////////////////////////
  private dataOnScreen:Array<VizCircleSectorVO> = [];
  ////////////////////////////
  private strokeColor:string;
  private strokeColorInvert:string;
  private strokeWidth:number;
  ///////////////////////
  private PI:number = Math.PI;
  ////////////////////////////
  ////////// parent //////////
  private parentCode:string;
  private parentRealCode:string;
  private parentData:VizCircleSectorVO;
  ///////////////////////
  private config:ConfigVizUgly;

  constructor(private service:MapVizService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['centroids']){
      this.updateData();
    }
    if(changes['initialized']){
      this.initialize();
    }
    if(changes['ww'] || changes['hh'] || changes['visible']){
      this.wwR = this.ww*this.dpi;
      this.hhR = this.hh*this.dpi;
      this.render();
    }
  }
  ngOnInit() {
    this.container = document.getElementById('viz-map') as HTMLElement;
    this.canvas = this.canvasRef.element.nativeElement as HTMLCanvasElement;
    this.canvasCTX  = this.canvas.getContext('2d',{willReadFrequently: true}) as CanvasRenderingContext2D;
    this.canvasCTX.imageSmoothingEnabled = false;
  }
  private initialize():void{
    if(this.initialized===false){ return; }
    if(this.ready===true){ return; }
    this.config = this.service.model.config.configViz;
    this.strokeColor = this.config.strokeColor(this.route.M1);
    this.strokeColorInvert = this.config.strokeColorInvert(this.route.M1);
    this.strokeWidth = this.config.strokeWidth*this.dpi;
    this.ready = true;
    this.updateData();
  }
  ngOnDestroy(): void {}
  ////////// rendering ////////////////
  private render():void{
    if(this.service.dataIsNotComplete==true){
      this.clearCanvas();
      return;
    }
    this.renderCanvas();
  }
  private clearCanvas():void{
    this.canvas = this.canvasRef.element.nativeElement as HTMLCanvasElement;
    this.canvasCTX  = this.canvas.getContext('2d',{willReadFrequently: true}) as CanvasRenderingContext2D;
    this.canvasCTX.imageSmoothingEnabled = false;
    this.canvasCTX.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  private renderCanvas():void{
    this.wwR = this.ww*this.dpi;
    this.hhR = this.hh*this.dpi;
    this.container = document.getElementById('viz-map') as HTMLElement;
    this.canvas = this.canvasRef.element.nativeElement as HTMLCanvasElement;
    this.canvasCTX  = this.canvas.getContext('2d',{willReadFrequently: true}) as CanvasRenderingContext2D;
    this.canvasCTX.imageSmoothingEnabled = false;
    /////// legend sizes /////////
    let valueTooSmallStartsFrom:number = -1;
    let valueMaxOnScreen:number = -1;
    let areaMaxOnScreen:number = -1;
    this.service.updateLegendSizes();
    //////////////////////////////

    let j:number=0;
    const K:number = this.centroids.length;
    let item:CentroidVO;
    let index:number;

    const hh:number = this.container.offsetHeight*this.dpi;
    const ww:number = this.container.offsetWidth*this.dpi;
    let valid:boolean;

    const minRadius:number = this.config.minCircleRadius*this.dpi;
    const maxRadius:number = Math.min(ww,hh)*this.config.maxCircleDiameterPercentage*0.5;
    const maxArea:number = this.PI*maxRadius*maxRadius;
    let maxPRC:number=-1;

    ///////////////////////////
    // 1: items on screen
    ///////////////////////////
    this.dataOnScreen=[];

    while(j<K){
      item = this.centroids[j];
      index = this.ids.indexOf(item.code);
      if(index!==-1){
        // optimized values for speed..
        this.data[index].x = (0.5+item.pixelCoords[0]*this.dpi) << 0;
        this.data[index].y = (0.5+item.pixelCoords[1]*this.dpi) << 0;
        valid = this.data[index].x>0 && this.data[index].y>0 && this.data[index].x<ww && this.data[index].y<hh;
        if(valid===true){
          this.dataOnScreen.push(this.data[index]);
          maxPRC = Math.max(maxPRC,this.data[index].percentageFromData);
        }
      }
      if(this.parentCode==='parent-'+item.code && valid===true){
        index = this.ids.indexOf(this.parentCode);
        this.data[index].x = (0.5+item.pixelCoords[0]*this.dpi) << 0;
        this.data[index].y = (0.5+item.pixelCoords[1]*this.dpi) << 0;
        this.dataOnScreen.push(this.data[index]);
        maxPRC = Math.max(maxPRC,this.data[index].percentageFromData);
      }
      j++;
    }
    this.dataOnScreen = [...this.dataOnScreen.sort((a: any, b: any)=> parseInt(b.percentageFromData) - parseInt(a.percentageFromData))];



    ///////////////////////////
    ///////////////////////////
    // 2: CANVAS-DRAW
    ///////////////////////////
    ///////////////////////////
    let i:number = 0;
    const L:number = this.dataOnScreen.length;
    let vo:VizCircleSectorVO;
    let prc:number;
    let radius:number = 0;
    let radiusTooSmall:boolean = false;

    let startAngleRad:number;
    let endAngleRad:number;


    this.canvas.width = this.canvas.width;
    if(this.vizPicking.canvas==undefined || this.vizPicking==undefined){
      // console.log('vizPicking.canvas - UNDEFINED....');
      return;
    }
    this.vizPicking.canvas.width = this.vizPicking.canvas.width;

    while(i<L) {
      vo = this.dataOnScreen[i];
      prc = vo.percentageFromData * 100 / (maxPRC);
      radius = Utils.radiusFromArea(maxArea * prc * 0.01);
      /////// legend /////////
      areaMaxOnScreen = areaMaxOnScreen<(maxArea * prc * 0.01)?(maxArea * prc * 0.01):areaMaxOnScreen;
      valueMaxOnScreen = valueMaxOnScreen<vo.value_total?vo.value_total:valueMaxOnScreen;
      ////////////////////////
      radiusTooSmall = radius < minRadius;
      radius = radiusTooSmall === true ? minRadius : radius;
      ////////////////////////////
      if(radiusTooSmall && vo.value_total>valueTooSmallStartsFrom){
        valueTooSmallStartsFrom = vo.value_total;
      }
      ////////////////
      // sector angles
      ////////////////

      startAngleRad =  Utils.angleToRadians(270);
      endAngleRad = Utils.angleToRadians(270+vo.degrees);

      const percentageParsed: string = vo.percentage.toFixed(1) !== '0.0' ? vo.percentage.toFixed(1) + '' : '0';
      if (percentageParsed !== '0') {
        ///////////////////
        // sector-FILL
        ///////////////////
        this.canvasCTX.beginPath();
       /* this.canvasCTX.fillStyle = vo.isParent===false?vo.property_color:color(vo.property_color).darker(0.5)+'';*/
        this.canvasCTX.fillStyle = vo.property_color;
        this.canvasCTX.moveTo(vo.x, vo.y);
        this.canvasCTX.arc(vo.x, vo.y, (radius - this.strokeWidth * 0.5), startAngleRad, endAngleRad, false);
        this.canvasCTX.lineTo(vo.x, vo.y);
        this.canvasCTX.fill();
        this.canvasCTX.closePath();

        ///////////////////
        // sector-strokes
        ///////////////////
        if (vo.percentage<100) {
            this.canvasCTX.lineWidth = this.strokeWidth;
            this.canvasCTX.strokeStyle = vo.isParent === true ? this.strokeColor : this.strokeColorInvert;

            this.canvasCTX.beginPath();
            this.canvasCTX.moveTo(vo.x, vo.y);
            this.canvasCTX.lineTo(vo.x, vo.y - (radius - this.strokeWidth * 0.5));
            this.canvasCTX.lineCap = 'round'; ///////////////////
            this.canvasCTX.setLineDash([]);   ///////////////////
            this.canvasCTX.stroke();
            this.canvasCTX.closePath();

            this.canvasCTX.beginPath();
            this.canvasCTX.moveTo(vo.x, vo.y);
            this.canvasCTX.lineTo(vo.x + (radius - this.strokeWidth * 0.5) * Math.cos(endAngleRad), vo.y + (radius - this.strokeWidth * 0.5) * Math.sin(endAngleRad));
            this.canvasCTX.lineCap = 'round'; ///////////////////
            this.canvasCTX.setLineDash([]);   ///////////////////
            this.canvasCTX.stroke();
            this.canvasCTX.closePath();
        }
      }
      ////////////////////////////
      // DATA-CIRCLE-stroke
      ////////////////////////////
      this.canvasCTX.beginPath();
      this.canvasCTX.lineWidth = this.strokeWidth;
      this.canvasCTX.strokeStyle = vo.isParent === true ? this.strokeColor : this.strokeColorInvert;
      this.canvasCTX.lineCap = 'round';
      this.canvasCTX.setLineDash(radiusTooSmall===true?[4*this.dpi,4*this.dpi]:[]);
      this.canvasCTX.arc(vo.x, vo.y, radius, 0, 2 * this.PI, false);
      this.canvasCTX.stroke();
      this.canvasCTX.closePath();


      //////////////////////////
      // PICKING-DRAW
      //////////////////////////
      this.vizPicking.canvasContext.beginPath();
      this.vizPicking.canvasContext.arc(vo.x, vo.y, radius + this.strokeWidth * 0.5, 0, 2 * this.PI, false);
      this.vizPicking.canvasContext.fillStyle = vo.picking_color;
      this.vizPicking.canvasContext.fill();

      i++;
    }
    //// legend /////////////////////////////
    this.service.updateLegendSizes(valueTooSmallStartsFrom,valueMaxOnScreen,areaMaxOnScreen, this.config.minCircleRadius);
    /////////////////////////////////////////
  }

  private updateData=():void=>{
    if(this.initialized==false){ return; }
    if(this.ready===false){ return; }

    this.data = [...this.service.vizService.data];
    this.ids = [...this.service.vizService.ids];
    this.strokeColor = this.config.strokeColor(this.route.M1);

    this.data.forEach((item:VizCircleSectorVO)=>{
      if(item.code.split('-').length===2){
        this.parentCode = item.code;
        this.parentRealCode = item.code.split('-')[1];
        this.parentData = item;
      }
    });


    this.render();
  }
  ////////// POP ////////////////
  public onPopShow=(ob:any):void=>{
    this.service.popService.type=2;
    const valueOB:VizCircleSectorVO = this.service.vizService.getValueObjectByColor(ob.color);
    if(valueOB===null){ return; }

    if(this.service.popService.vo===null || this.service.popService.vo.code!==valueOB.code){
      this.service.popService.createPopVO(valueOB.code,'over');
    }
    this.service.popService.show(this.service.popService.vo,ob.x,ob.y);
  }
  public onPopHide=():void=>{
    this.service.popService.hide();
  }
  public onPopPosition=(ob:any):void=>{
    this.service.popService.positionUpdate({x:ob.x,y:ob.y});
  }
  private radiusSizeDebug(ww:number,hh:number,maxRadius:number):void{
    this.canvasCTX.beginPath();
    this.canvasCTX.lineWidth = 4;
    this.canvasCTX.strokeStyle='#f700ff';
    this.canvasCTX.rect((ww-maxRadius*2)*0.5, (hh-maxRadius*2)*0.5, maxRadius*2, maxRadius*2);
    this.canvasCTX.stroke();
    this.canvasCTX.closePath();
  }
}
