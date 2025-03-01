import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {MapVizService} from "../../../../services/map-viz.service";
import {ClusterVO} from "../../../../../model/vo/ClusterVO";
import {TitlesVO} from "../../../../../model/vo/TitlesVO";
import {DomElementsInfo} from "../../../../../../app/model/vo/DomElementsInfo";
import {TranslationVO} from "../../../../../../app/model/vo/TranslationVO";


@Component({
  selector: 'map-legend-pop',
  templateUrl: './map-legend-pop.component.html',
  styleUrls: ['./map-legend-pop.component.scss']
})
export class MapLegendPopComponent implements OnInit,OnDestroy {


  /* TODO - MUST FIX this class */

  public mobile:boolean = false;
  public visible:boolean = false;
  public lang:string;
  public onClose:any;
  public initialized:boolean = false;

  public t1:string='3';
  public t2:string='none';

  public m1:string='e'; // w,h
  public m2:string='e';// e, vp, va
  public m3:string='none';

  public clusters:Array<ClusterVO> = [];
  public impossibleData:boolean = false;
  public zerroData:boolean = false;
  public isEmpty:boolean = true;

  private onModelReadyListener:any;
  private onTitlesUpdateListener:any;
  private onDataUpdateListener:any;
  private onDomUpdateListener:any;

  public isVisible_list:boolean = false;
  public isVisible_circles:boolean = true;
  public dataIsNotComplete:boolean = false;


  // legend-choro-title-e
  // legend-choro-title-av
  // legend-choro-title-vp

  // legend-choro-subtitle-e
  // legend-choro-subtitle-av
  // legend-choro-subtitle-vp

  public titleColorsVO:TranslationVO;
  public subtitleColorsVO:TranslationVO;

  public titleCirclesVO:TranslationVO;
  public titleListVO:TranslationVO;


  private legendContainer:HTMLElement;
  public ww:number=0;
  public wwMin:number=720;
  public horizontal:boolean = true;
  public titlesVO:TitlesVO;


  constructor(private service:MapVizService, public dom:DomElementsInfo) {}
  private resizeContainer():void{
    if(this.legendContainer){
      this.horizontal = this.legendContainer.offsetWidth>this.wwMin;
    }
  }
  ngOnInit() {
    this.onModelReadyListener = this.service.model.onModelReady.subscribe(this.onModelReady);
    this.onTitlesUpdateListener = this.service.titlesService.onServiceChange.subscribe(this.onTitlesUpdate);
    this.onDataUpdateListener = this.service.legendService.onDataUpdate.subscribe(this.onDataUpdate);
    this.onDomUpdateListener = this.dom.onUpdate.subscribe(this.onDomElementsUpdate);

    this.legendContainer = document.getElementById('legendContainer') as HTMLElement;

    if(this.service.model.READY===true){
      this.initialize();
    }
  }
  ngOnDestroy(): void {
    this.onModelReadyListener.unsubscribe();
    this.onTitlesUpdateListener.unsubscribe();
    this.onDataUpdateListener.unsubscribe();
    this.onDomUpdateListener.unsubscribe();
  }
  public onDataUpdate=():void=>{
    /*
    // console.log('****************');
    // console.log('MAP-LEGEND - onDataUpdate');
    // console.log('****************');
    */
    this.dataIsNotComplete = this.service.dataIsNotComplete;
  }

  public update(clusters:Array<ClusterVO>,impossibleData:boolean,zerroData:boolean):void{
    this.clusters = [...clusters].reverse();
    this.isEmpty = this.clusters.length===0;
    this.impossibleData = impossibleData;
    this.zerroData = zerroData;

    /*
    // console.log('****************');
    // console.log('MAP-LEGEND - update() initialized:'+this.initialized);
    // console.dir(this.clusters);
    // console.log('****************');
    // console.log('isEmpty:'+this.isEmpty);
    // console.log('impossibleData:'+this.impossibleData);
    // console.log('zerroData: '+this.zerroData);
    // console.log('visible: '+this.visible);
    // console.log('****************');
    */
  }

  initialize():void{
    if(this.initialized===true){return;}

    this.lang = this.service.route.lang;
    this.mobile = this.dom.isMobile;
    this.visible = this.dom.legendIsVisible;

    this.m1 = this.service.route.M1;
    this.m2 = this.service.route.M2;
    this.m3 = this.service.route.M3;
    this.t1 = this.service.route.T1;
    this.t2 = this.service.route.T2;
    this.initialized = true;

    this.checkVisibility();
    this.updateLocalizations();

    this.isEmpty = this.clusters.length===0;
    this.dataIsNotComplete = this.service.dataIsNotComplete;
    this.resizeContainer();

  }
  private checkVisibility():void{
    this.isVisible_list = this.m3!=='none';
  }
  private updateLocalizations():void{
    switch (this.m2) {
      case 'e':
        this.titleColorsVO = this.service.model.translations.item('legend-choro-title-e');
        this.subtitleColorsVO = this.service.model.translations.item('legend-choro-subtitle-e');
        break;
      case 'av':
        this.titleColorsVO = this.service.model.translations.item('legend-choro-title-av');
        this.subtitleColorsVO = this.service.model.translations.item('legend-choro-subtitle-av');
        break;
      case 'vp':
        this.titleColorsVO = this.service.model.translations.item('legend-choro-title-vp');
        this.subtitleColorsVO = this.service.model.translations.item('legend-choro-subtitle-vp');
        break;
    }
    this.titleCirclesVO = this.service.model.translations.item('legend-circles-title');

    switch (this.m3) {
      case 'i':
        this.titleListVO = this.service.model.translations.item('legend-info-title-i');
        break;
      case 'p':
        this.titleListVO = this.service.model.translations.item('legend-info-title-p');
        break;
      case 's':
        this.titleListVO = this.service.model.translations.item('legend-info-title-s');
        break;
    }
  }
  private onModelReady=():void=>{
    if(this.initialized===true){return;}
    this.initialize();
  }


  private onTitlesUpdate=():void=>{
    this.titlesVO = this.service.titlesService.vo;
  }
  public onCloseClick():void{
    this.visible = false;
    this.onClose();
  }
  @HostListener('window:resize', ['$event'])
  onHostResize(event:Event){
    this.resizeContainer();
  }

  @HostListener('window:orientationchange', ['$event'])
  onHostOrientationChange(event:Event){
    this.resizeContainer();
  }

  private onDomElementsUpdate=():void=>{
    this.visible = this.dom.legendIsVisible;
    this.mobile = this.dom.isMobile;
  }


}
