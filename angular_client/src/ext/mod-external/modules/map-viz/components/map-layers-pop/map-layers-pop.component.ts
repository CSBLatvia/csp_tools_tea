import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MapVizService} from "../../../../services/map-viz.service";
import {ControlValueVO} from "../../../../../ui-controls/vos/ControlValueVO";

@Component({
  selector: 'map-layers-pop',
  templateUrl: './map-layers-pop.component.html',
  styleUrls: ['./map-layers-pop.component.scss']
})
export class MapLayersPopComponent implements OnInit,OnDestroy {


  @Input() mobile:boolean = false;
  @Input() visible:boolean = false;
  @Input() lang:string;
  @Input() radio_id:string = '';
  @Input() radio_values:Array<ControlValueVO>=[];
  @Input() onClose:any;
  @Input() onChange:any;

  public initialized:boolean = false;


  private onModelReadyListener:any;
  private onLanguageUpdateListener:any;



  constructor(private service:MapVizService) {}
  ngOnDestroy():void{
    this.onModelReadyListener.unsubscribe();
    this.onLanguageUpdateListener.unsubscribe();
  }
  ngOnInit() {
    this.onModelReadyListener = this.service.model.onModelReady.subscribe(this.onModelReady);
    this.onLanguageUpdateListener = this.service.model.onLanguageUpdate.subscribe(this.onLanguageUpdate);
    if(this.service.model.READY===true && this.initialized===false){
      this.initialize();
    }
  }
  private onModelReady=():void=>{
    this.initialize();
  }
  private onLanguageUpdate=():void=>{
    if(this.initialized===false){return;}
    this.lang = this.service.model.route.lang;
    this.radio_values.forEach((item:ControlValueVO)=>{
      item.name.lang = this.lang;
    });
  }
  private initialize():void{
    if(this.initialized===true){return;}
    this.lang = this.service.model.route.lang;

    /*
    'map-light-rupucs',
    'map-dark-rupucs',
    'map-light',
    'map-dark',
    'map-osm',
    'map-orto'
 */

    this.service.map_style_ids.forEach((item:string)=>{
      this.radio_values.push(new ControlValueVO(item,this.service.model.translations.item(item)));
    });

/*    this.radio_values = [
      new ControlValueVO('map-light-rupucs',this.service.model.translations.item('map-light-rupucs')),
      new ControlValueVO('map-dark-rupucs',this.service.model.translations.item('map-dark-rupucs')),

      new ControlValueVO('map-light',this.service.model.translations.item('map-layer-light')),
      new ControlValueVO('map-dark',this.service.model.translations.item('map-layer-dark')),
      new ControlValueVO('map-osm',this.service.model.translations.item('map-layer-osm')),
      new ControlValueVO('map-orto',this.service.model.translations.item('map-layer-orto'))
    ];*/

    this.radio_id = this.service.MAP_POP_STYLE;
    this.initialized = true;
  }
  public onCloseClick=():void=>{
    this.visible = false;
    this.onClose();
  }
  public onRadioChange=(item:any):void=>{
    this.onChange(item.id);
    this.visible = false;
    this.onClose();
  }

}
