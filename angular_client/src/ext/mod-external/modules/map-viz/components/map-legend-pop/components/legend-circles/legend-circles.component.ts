import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {MapVizService} from "../../../../../../services/map-viz.service";
import {TitlesVO} from "../../../../../../../model/vo/TitlesVO";
import {ControlValueVO} from "../../../../../../../ui-controls/vos/ControlValueVO";
import {TranslationVO} from "../../../../../../../../app/model/vo/TranslationVO";


@Component({
  selector: 'app-legend-circles',
  templateUrl: './legend-circles.component.html',
  styleUrls: ['./legend-circles.component.scss']
})
export class LegendCirclesComponent implements OnInit,OnDestroy,OnChanges {

  @Input() horizontal:boolean = true;
  @Input() lang:string;
  @Input() titlesVO:TitlesVO;
  @Input() dataIsNotComplete:boolean = false;

  private onModelReadyListener:any;


  public dataVO_h:ControlValueVO;
  public dataVO_w:ControlValueVO;
  public initialized:boolean = false;
  public noDataTitle:TranslationVO;

  constructor(private service:MapVizService) {
  }
  ngOnDestroy(): void {
    this.onModelReadyListener.unsubscribe();
  }
  ngOnInit() {
    this.onModelReadyListener = this.service.model.onModelReady.subscribe(this.onModelReady);

    if(this.service.model.READY===true && this.initialized===false){
      this.initialize();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['lang']){
      this.updateLocalizations();
      //
    }
  }
  private onModelReady=():void=>{
    if(this.initialized===true){return;}
    this.initialize();
  }
  initialize():void{
    if(this.initialized===true){return;}

    this.lang = this.service.model.route.lang;
    this.noDataTitle = this.service.model.translations.item('legend-no-data-info');
    this.noDataTitle.lang = this.lang;
    this.dataVO_h = new ControlValueVO('h',this.service.model.translations.item('m1-value-2'),false,0, this.service.model.config.home_color);
    this.dataVO_w = new ControlValueVO('w',this.service.model.translations.item('m1-value-1'),false,1, this.service.model.config.work_color);
    this.initialized = true;
    this.updateLocalizations();
  }
  private updateLocalizations():void{
    if(this.initialized===false){return;}
    this.lang = this.service.model.route.lang;
    this.noDataTitle.lang = this.lang;
    this.dataVO_h.name.lang = this.lang;
    this.dataVO_w.name.lang = this.lang;
  }

}
