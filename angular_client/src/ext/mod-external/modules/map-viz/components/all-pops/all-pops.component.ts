import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PopMapComponent} from '../pop-ups/pop-map/pop-map.component';
import {PopCirclesComponent} from '../pop-ups/pop-circles/pop-circles.component';
import {IPop} from '../pop-ups/IPop';
import {MapPopService} from "../../services/map-pop/map-pop.service";


@Component({
  selector: 'all-pops',
  templateUrl: './all-pops.component.html',
  styleUrls: ['./all-pops.component.scss']
})
export class AllPopsComponent implements OnInit,OnDestroy {



  //////////////////////
  @ViewChild('popMap', { read: PopMapComponent, static: false }) popMap: PopMapComponent;
  @ViewChild('popCircles', { read: PopCirclesComponent, static: false }) popCircles: PopCirclesComponent;

  @Input() showLocalizations:boolean;

  private pop:IPop;
  //////////////////////
  private onPopShowListener:any;
  private onPopHideListener:any;
  private onPopPositionListener:any;
  /////////////////////////////////
  public visible:boolean = false;
  public type:number=-1;
  public x:number = 1;
  public y:number = 1;




  constructor(private popService:MapPopService) { }

  ngOnDestroy(): void {
    this.onPopShowListener.unsubscribe();
    this.onPopHideListener.unsubscribe();
    this.onPopPositionListener.unsubscribe();
  }

  ngOnInit(): void {
    this.onPopShowListener = this.popService.onShow.subscribe(this.onPopShow);
    this.onPopHideListener = this.popService.onHide.subscribe(this.onPopHide);
    this.onPopPositionListener = this.popService.onPositionUpdate.subscribe(this.onPopPosition);
  }

  /////////////////////////////////////////////
  // POP-SERVICE
  /////////////////////////////////////////////
  public onPopShow=(ob:any):void=>{

    this.type = ob.type;
    this.x = ob.x;
    this.y = ob.y;

    switch (this.type) {
      case 1:
        this.createPopMap(ob);
        break;
      case 2:
        this.createPopCircles(ob);
        break;
    }
    this.visible = true;

  }
  public onPopHide=():void=>{
    if(this.visible===false){return;}
    this.type = -1;
    this.visible = false;
  }
  public onPopPosition=(ob:any):void=>{
    if(this.visible===false){return;}
    this.x = ob.x;
    this.y = ob.y;
    this.pop.x = this.x;
    this.pop.y = this.y;
  }
  ////////////////////////
  private createPopMap=(ob:any):void=>{
    this.pop = this.popMap;
    this.pop.vo = ob.vo;
    this.pop.x = this.x;
    this.pop.y = this.y;
  }
  private createPopCircles=(ob:any):void=>{
    this.pop = this.popCircles;
    this.pop.vo = ob.vo;
    this.pop.x = this.x;
    this.pop.y = this.y;
  }

}
