import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {RouteVO} from "../../../../model/vo/RouteVO";
import {TranslationVO} from "../../../../model/vo/TranslationVO";
import {ModelService} from "../../../../model/model.service";

@Component({
  selector: 'app-top-menu-desktop-full',
  templateUrl: './top-menu-desktop-full.component.html',
  styleUrls: ['../top-menu.component.scss']
})
export class TopMenuDesktopFullComponent implements OnInit {


  public route:RouteVO;
  public buttonLV:TranslationVO;
  public buttonEN:TranslationVO;
  public title:TranslationVO;
  @ViewChild('settingsContainer', { read: ViewContainerRef, static: true }) settingsContainer:ViewContainerRef;


  constructor(public model:ModelService) {}

  ngOnInit(){
    this.route = this.model.getRoute();
    this.model.onModelReady.subscribe(this.onModelReady);
    this.model.onLanguageUpdate.subscribe(this.onLanguageUpdate);
    this.model.onRouteUpdate.subscribe(this.onRouteUpdate);
    if(this.model.READY===true){
      this.initialize();
    }
  }
  public changeLanguageClick(lang:string):void{
    this.route.lang = lang;
    this.model.setRouteValues(this.route);
  }
  private onRouteUpdate=():void=>{
    this.route = this.model.getRoute();
  }
  public changeViewClick(view:string):void{
    this.route.view = view;
    this.model.setRouteValues(this.route);
  }
  private onModelReady=():void=>{
    this.initialize();
  }
  initialize():void{
    this.route = this.model.getRoute();
    this.title = this.model.translations.item('tool-top-menu-title');
    this.buttonLV = this.model.translations.item('top-menu-button-lv');
    this.buttonEN = this.model.translations.item('top-menu-button-en');
  }
  private onLanguageUpdate=():void=>{
    this.route = this.model.getRoute();
    this.title.lang = this.route.lang;
  }

}
