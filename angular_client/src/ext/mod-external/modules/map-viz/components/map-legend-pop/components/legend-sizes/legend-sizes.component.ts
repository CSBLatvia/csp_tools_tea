import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {MapVizService} from "../../../../../../services/map-viz.service";
import {TitlesVO} from "../../../../../../../model/vo/TitlesVO";
import {Utils} from "../../../../../../../../app/model/inc/Utils";
import {TranslationVO} from "../../../../../../../../app/model/vo/TranslationVO";

@Component({
  selector: 'app-legend-sizes',
  templateUrl: './legend-sizes.component.html',
  styleUrls: ['./legend-sizes.component.scss']
})
export class LegendSizesComponent implements OnInit,OnDestroy,OnChanges {

  @Input() lang:string;
  @Input() titlesVO:TitlesVO;
  @Input() dataIsNotComplete:boolean = false;

  private onDataUpdateListener:any;
  private onModelReadyListener:any;
  private onSizesInfoUpdateListener:any;
  public initialized:boolean = false;

  private minTitleVO:TranslationVO;
  private areaTitleVO:TranslationVO;
  private areaTitleEmptyVO:TranslationVO;

  public valueTooSmallStartsFrom:number=-1;
  public valueMaxOnScreen:number=-1;
  public areaMaxOnScreen:number=-1;
  public minRadius:number=-1;


  public minTitle:string;
  public areaTitle:string;
  private pixels:number = 100;
  private pixelsArea:number=-1;
  public noDataTitle:TranslationVO;

  constructor(private service:MapVizService) {}
  ngOnDestroy(): void {
    this.onDataUpdateListener.unsubscribe();
    this.onModelReadyListener.unsubscribe();
    this.onSizesInfoUpdateListener.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['lang']){
      this.updateLocalizations();
      //
    }
  }
  ngOnInit() {
    this.onModelReadyListener = this.service.model.onModelReady.subscribe(this.onModelReady);
    this.onDataUpdateListener = this.service.legendService.onDataUpdate.subscribe(this.onDataUpdate);
    this.onSizesInfoUpdateListener = this.service.legendService.onSizesInfoUpdate.subscribe(this.onSizesInfoUpdate);

    if(this.service.model.READY===true && this.initialized===false){
      this.initialize();
    }
  }
  private onModelReady=():void=>{
    if(this.initialized===true){return;}
    this.initialize();
  }
  initialize():void{
    if(this.initialized===true){return;}
    this.initialized = true;
    this.onDataUpdate();
    this.onSizesInfoUpdate();
  }
  public onDataUpdate=():void=>{
    const M2:string = this.service.route.M2;
    this.minTitleVO = this.service.model.translations.item('legend-sizes-circle-min-'+M2);
    this.areaTitleVO = this.service.model.translations.item('legend-sizes-circle-area-'+M2);
    this.areaTitleEmptyVO = this.service.model.translations.item('legend-sizes-circle-area-no-data');
    this.updateSizeTexts();
  }
  public onSizesInfoUpdate=():void=>{
    this.dataIsNotComplete = this.service.dataIsNotComplete;
    this.valueTooSmallStartsFrom = this.service.legendService.valueTooSmallStartsFrom;
    this.valueMaxOnScreen = this.service.legendService.valueMaxOnScreen;
    this.areaMaxOnScreen = this.service.legendService.areaMaxOnScreen;
    this.minRadius = this.service.legendService.minRadius;
    console.log('LEGEND - minRadius:'+this.minRadius);

    if(this.areaMaxOnScreen!==-1 && this.valueMaxOnScreen!==-1){
      this.pixelsArea = this.pixels*this.valueMaxOnScreen/this.areaMaxOnScreen;
    }else{
      this.pixelsArea = -1;
    }

    this.updateSizeTexts();
  }
  private updateLocalizations():void{
    if(this.initialized===false){return;}
    this.lang = this.service.route.lang;
    this.updateSizeTexts();
  }
  private updateSizeTexts():void{
    this.noDataTitle = this.service.model.translations.item('legend-no-data-info');
    this.noDataTitle.lang = this.lang;

    if(this.valueTooSmallStartsFrom!==-1){
      this.minTitle = this.lang==='lv'?this.minTitleVO.name_lv.replace('[value]',Utils.prettyNumber(this.valueTooSmallStartsFrom,this.lang)):this.minTitleVO.name_en.replace('[value]',Utils.prettyNumber(this.valueTooSmallStartsFrom,this.lang));
    }else{
      this.minTitle='';
    }

    if(this.pixelsArea!==-1){
      this.areaTitle = this.lang==='lv'?this.areaTitleVO.name_lv.replace('[area]',this.pixels+'').replace('[value]',Utils.prettyNumber(this.pixelsArea,this.lang)):this.areaTitleVO.name_en.replace('[area]',this.pixels+'').replace('[value]',Utils.prettyNumber(this.pixelsArea,this.lang));
    }else{
      this.areaTitle = this.lang==='lv'?this.areaTitleEmptyVO.name_lv.replace('[area]',this.pixels+''):this.areaTitleEmptyVO.name_en.replace('[area]',this.pixels+'');
    }

  }

}
