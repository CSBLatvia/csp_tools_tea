import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TranslationVO} from '../../model/vo/TranslationVO';
import {ModelService} from '../../model/model.service';

@Component({
  selector: 'app-big-title',
  templateUrl: './big-title.component.html',
  styleUrls: ['./big-title.component.scss']
})
export class BigTitleComponent implements OnInit,OnDestroy {

  @Input() verticalGap:boolean = false;
  public title:TranslationVO;
  @Input() title_id:string='';
  @Input() titleSTR:string = '';

  private onModelReadyListener:any;

  constructor(private model: ModelService) { }

  ngOnDestroy(){
    this.onModelReadyListener.unsubscribe();
  }
  ngOnInit() {
    this.onModelReadyListener = this.model.onModelReady.subscribe(this.onModelReady);
    if(this.model.READY===true){
      this.title = this.model.translations.item(this.title_id);
    }
  }
  private onModelReady=():void=>{
    this.title = this.model.translations.item(this.title_id);
  }

}
