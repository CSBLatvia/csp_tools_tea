import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {TranslationVO} from "../../app/model/vo/TranslationVO";
import {MiniModelService} from "../../app/model/minimodel.service";

@Directive({
  selector: '[ariaEnabled]'
})
export class AriaEnabledDirective implements OnInit,OnDestroy,OnChanges {

  @Input() role:string='';
  @Input() ariaLabel:string='';
  @Input() ariaLabelID:string='';
  private ariaLabelID_VO:TranslationVO;
  @Input() ariaLive:boolean=false;

  private tabIndex:number=0;
  private id:string='';
  private initialized:boolean = false;


  @HostBinding('tabindex')
  public attr_tab_index: number = 0;


  $event: any;
  private onModelReadyListener:any;
  private onLanguageUpdateListener:any;

  private disabledElements:Array<string>=['BUTTON'];

  constructor(public element: ElementRef,private model:MiniModelService,private liveAnnouncer:LiveAnnouncer) {
    this.id = uuidv4();

    this.onModelReadyListener = this.model.onModelReady.subscribe(this.onModelReady);
    this.onLanguageUpdateListener = this.model.onLanguageUpdate.subscribe(this.onLanguageUpdate);
    if(this.model.READY===true){
      this.initialize();
    }
  }

  public ngOnInit(): void {
    this.checkReady();
  }
  public ngOnChanges(changes: SimpleChanges):void {
      this.checkReady();
  }
  private checkReady():void{
    this.setAttributes();
  }

  public ngOnDestroy():void {
    this.onModelReadyListener.unsubscribe();
    this.onLanguageUpdateListener.unsubscribe();
  }
  public onModelReady=():void=>{
    this.initialize();
  }
  private initialize():void{
    if(this.initialized===true){return;}
    this.initialized = true;
    this.checkReady();
  }
  private setAttributes():void{
    if(this.role!==''){
      this.element.nativeElement.setAttribute('role',this.role);
    }
    if(this.ariaLabel!=='' && this.ariaLabel!==null){
      this.element.nativeElement.setAttribute('aria-label',this.ariaLabel);
    }
    if(this.ariaLabelID!==''){
      this.ariaLabelID_VO = this.model.translations.item(this.ariaLabelID);
      if(this.ariaLabelID_VO!==null){
        this.element.nativeElement.setAttribute('aria-label',this.ariaLabelID_VO.name);
      }
    }
    if(this.tabIndex!==0){
      this.attr_tab_index = this.tabIndex;
    }
  }
  private onLanguageUpdate=():void=>{
    if(this.initialized===false){return;}
    this.checkReady();
  }

  @HostListener('keyup.enter', ["$event"])
  public onEnterKeyUp(e: KeyboardEvent): void {
    const tagName:string = this.element.nativeElement.tagName;
    e.preventDefault();
    e.stopPropagation();
    if(this.disabledElements.indexOf(tagName)!==-1){
      return;
    }
    ///////////////////////////////////
    this.element.nativeElement.click();
  }
  @HostListener('keyup.space', ["$event"])
  public onSpaceKeyUp(e: KeyboardEvent): void {
    const tagName:string = this.element.nativeElement.tagName;
    e.preventDefault();
    e.stopPropagation();
    if(this.disabledElements.indexOf(tagName)!==-1){
      return;
    }
    ///////////////////////////////////
    this.element.nativeElement.click();
  }



  @HostListener('focus', ["$event"])
  public onFocus(e: any){
    if(this.ariaLive==false){
      return;
    }
    if(this.ariaLabel!==''){
      this.liveAnnouncer.announce(this.ariaLabel);
    }
    if(this.ariaLabelID_VO!==null){
      this.liveAnnouncer.announce(this.ariaLabelID_VO.name);
    }
  }
  @HostListener('focusout', ["$event"])
  public onFocusout(e: any) {
  }


}



