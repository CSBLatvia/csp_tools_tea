import {WindowRefService} from "../../ext/model/services/window/window-ref.service";
import {Injectable} from "@angular/core";
import {ColorCategories} from "./inc/ColorCategories";
import {ConfigMapColors} from "../../ext/model/configs/ConfigMapColors";
import {ConfigVizUgly} from "../../ext/model/configs/ConfigVizUgly";
import {ConfigViz} from "../../ext/model/configs/ConfigViz";

@Injectable({
  providedIn: 'root'
})

export class Config{

    public hostURL:string;
    public hostName:string;
    public serviceURL:string;
    public externalComponentsURL:string;
    public translationsFrom:string='db';
    public stats_id:string = '';


    public geoServerTilesURL:string='';
    public osmTilesURL:string;
    public ortoTilesURL:string;

    public mapBoxLayer_1:string;
    public mapBoxLayer_3:string;
    public mapBoxLayer_4:string;
    public mapBoxLayer_7:string;


  public work_color:string;
  public home_color:string;


  public colorCategories:ColorCategories;

  public mapColors:ConfigMapColors;
  public configViz:ConfigVizUgly;



    ///////////////////////////////////////////
    public DPI:number;
    public screenMaxWidth:number;
    public screenMaxHeight:number;
    public screenMaxHypo:number;

    constructor(public window: WindowRefService = null){
      if(window==null){
        window = new WindowRefService();
      }
      this.mapColors = new ConfigMapColors();
      this.configViz = new ConfigVizUgly();

      this.DPI = window.nativeWindow.devicePixelRatio || 1;
      this.screenMaxWidth =  window.nativeWindow.innerWidth;
      this.screenMaxHeight = window.nativeWindow.innerHeight;
      this.screenMaxHypo = Math.sqrt(this.screenMaxWidth*this.screenMaxWidth + this.screenMaxHeight*this.screenMaxHeight);
    }
}




