import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {TranslationVO} from '../../../../model/vo/TranslationVO';
import {ModelService} from '../../../../model/model.service';

import {RouteVO} from "../../../../model/vo/RouteVO";
import {SettingsMobile} from "./settings-mobile/settings-mobile";


@Component({
  selector: 'app-top-menu-mobile',
  templateUrl: './top-menu-mobile.component.html',
  styleUrls: ['../top-menu.component.scss']
})
export class TopMenuMobileComponent implements OnInit {

  public route:RouteVO;
  public buttonLV:TranslationVO;
  public buttonEN:TranslationVO;
  public title:TranslationVO;

  @ViewChild('settingsContainer', { read: ViewContainerRef, static: true }) settingsContainer:ViewContainerRef;
  private settingsFactory:ComponentFactory<SettingsMobile>;
  private settingsRef:ComponentRef<SettingsMobile>;

  constructor(private model:ModelService, private resolver: ComponentFactoryResolver) {}

  ngOnInit(){
    this.route = this.model.getRoute();
    this.model.onModelReady.subscribe(this.onModelReady);
    this.model.onLanguageUpdate.subscribe(this.onLanguageUpdate);
    this.model.onRouteUpdate.subscribe(this.onRouteUpdate);
    this.settingsFactory = this.resolver.resolveComponentFactory(SettingsMobile);
    if(this.model.READY===true){
      this.initialize();
    }
  }

  public changeLanguageClick(lang:string):void{
    const route:RouteVO = this.model.getRoute();
          route.lang = lang;
    this.model.setRouteValues(route);
  }
  public changeViewClick(view:string='landing'):void{
    const route:RouteVO = this.model.getRoute();
          route.view = view;
    this.model.setRouteValues(route);
  }
  public openSettingsClick():void{
    this.settingsRef = this.settingsContainer.createComponent(this.settingsFactory);
  }
  private onModelReady=():void=>{
    this.initialize();
  }
  initialize():void{
    this.route = this.model.getRoute();
    this.buttonLV = this.model.translations.item('top-menu-button-lv');
    this.buttonEN = this.model.translations.item('top-menu-button-en');
    this.title = this.model.translations.item('tool-top-menu-title');
  }
  private onLanguageUpdate=():void=>{
    this.route = this.model.getRoute();
    this.title.lang = this.route.lang;
  }
  private onRouteUpdate=():void=>{
    this.route = this.model.getRoute();
    this.title.lang = this.route.lang;
  }
}
