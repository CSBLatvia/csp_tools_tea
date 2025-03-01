import {Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import {TranslationVO} from "../../../../app/model/vo/TranslationVO";
import {ABlock} from "../../../../app/model/ABlock";



@Component({
  selector: 'share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss']
})

export class ShareButtonComponent implements OnChanges{

  @Input() URL:string;
  @Input() lang:string;

  public open:boolean = false;

  public popTitle:TranslationVO = new TranslationVO('','Saite kopīgošanai','URL to share');
  public popClose:TranslationVO = new TranslationVO('','Aizvērt','Close');
  public popCopy:TranslationVO = new TranslationVO('','Kopēt','Copy');
  public infoSuccess:TranslationVO = new TranslationVO('','URL ir nokopēts..','URL has been copied..');

  @ViewChild('share', { read: ViewContainerRef, static: true }) share:ViewContainerRef;
  @ViewChild('info', { read: ViewContainerRef, static: true }) info:ViewContainerRef;

  constructor(private clipboard: Clipboard) {}

  ngOnChanges(changes: SimpleChanges):void {
    if(changes['lang']){
      this.updateTranslations();
    }
  }
  private updateTranslations(){
    this.popTitle.lang = this.lang;
    this.popClose.lang = this.lang;
    this.popCopy.lang = this.lang;
    this.infoSuccess.lang = this.lang;
  }
  public onShareClick=():void=>{
    // this.open = true;
    this.clipboard.copy(this.URL);

    let button:HTMLElement = this.share.element.nativeElement;
    let info:HTMLElement = this.info.element.nativeElement;

    button.style.display = "none";
    info.style.display = "block";

    setTimeout(() => {
      info.style.display = "none";
      button.style.display = "block";
    }, 1500); // 2 seconds
  }
  public onPopCopy():void{
    this.clipboard.copy(this.URL);
    this.open = false;
  }
  public onPopCancel():void{
    this.open = false;
  }

}
