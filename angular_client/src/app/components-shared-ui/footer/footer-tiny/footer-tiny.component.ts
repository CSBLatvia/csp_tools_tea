import {AfterViewInit, Component, HostListener, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {RouteVO} from "../../../model/vo/RouteVO";
import {TranslationVO} from "../../../model/vo/TranslationVO";
import {ModelService} from "../../../model/model.service";
import {DomElementsInfo} from "../../../model/vo/DomElementsInfo";

@Component({
  selector: 'app-footer-tiny',
  templateUrl: './footer-tiny.component.html',
  styleUrls: ['../footer.component.scss']
})
export class FooterTinyComponent implements OnInit,AfterViewInit {


  public route:RouteVO;
  public ownerTitle:TranslationVO;
  public ownerValue:TranslationVO;

  public phoneTitle:TranslationVO;
  public phoneValue:TranslationVO;

  public mailTitle:TranslationVO;
  public mailValue:TranslationVO;

  public aboutTitle:TranslationVO;
  public aboutValue:TranslationVO;

  public apiTitle:TranslationVO;
  public apiValue:TranslationVO;

  public groupContactsTitle:TranslationVO;
  public groupOtherTitle:TranslationVO;

  public visible:boolean = true;


  @Input() containerID:string = 'csbApp';
  @ViewChild('footer', { read: ViewContainerRef, static: true }) footer:ViewContainerRef;

  private initialized:boolean = false;

  constructor(private model: ModelService, private dom:DomElementsInfo) { }

  ngOnDestroy():void{

  }
  ngOnInit() {

    this.model.onModelReady.subscribe(this.onModelReady);
    this.model.onLanguageUpdate.subscribe(this.onLanguageUpdate);
    this.model.onRouteUpdate.subscribe(this.onRouteUpdate);

    if(this.model.READY===true){
      this.initialize();
    }
  }
  ngAfterViewInit() {
    this.dom.footer.height = this.footer.element.nativeElement.offsetHeight;
    this.dom.footer.update();
    //this.dom.update();
  }


  private onModelReady=():void=>{
    this.initialize();
  }
  private onLanguageUpdate=():void=>{
    if(this.initialized===false){return;}
    this.route = this.model.getRoute();
    this.aboutValue.lang = this.route.lang;
    this.apiValue.lang = this.route.lang;

    this.groupContactsTitle.lang = this.route.lang;
    this.groupOtherTitle.lang = this.route.lang;
  }
  private onRouteUpdate=():void=>{
    if(this.initialized===false){return;}
    this.route = this.model.getRoute();
    this.aboutValue.lang = this.route.lang;
    this.apiValue.lang = this.route.lang;
  }
  initialize():void{
    if(this.initialized===true){return;}
    this.route = this.model.getRoute();

    this.groupContactsTitle = this.model.translations.item('footer-group-contacts');
    this.groupOtherTitle = this.model.translations.item('footer-group-other');
    this.groupContactsTitle.lang = this.route.lang;
    this.groupOtherTitle.lang = this.route.lang;

    this.ownerTitle = this.model.translations.item('footer-copyright');
    this.ownerValue = this.model.translations.item('footer-owner');

    this.phoneTitle = this.model.translations.item('footer-phone-title');
    this.phoneValue = this.model.translations.item('footer-phone');

    this.mailTitle = this.model.translations.item('footer-mail-title');
    this.mailValue = this.model.translations.item('footer-mail');

    this.aboutTitle = this.model.translations.item('footer-about-title');
    this.aboutValue = new TranslationVO('about',this.model.config.hostName+'/lv/about',this.model.config.hostName+'/en/about');
    this.aboutValue.lang = this.route.lang;

    this.apiTitle = this.model.translations.item('footer-api-title');
    this.apiValue = new TranslationVO('api',this.model.config.hostName+'/lv/api',this.model.config.hostName+'/en/api');
    this.apiValue.lang = this.route.lang;

    this.initialized = true;
  }


}
