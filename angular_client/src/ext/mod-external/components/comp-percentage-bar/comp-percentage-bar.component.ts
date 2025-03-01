import {Component, HostListener} from '@angular/core';
import {PercentageBarService} from "../../services/percentage-bar.service";
import {AComponent} from "../../../model/AComponent";

@Component({
  selector: 'app-comp-percentage-bar',
  templateUrl: './comp-percentage-bar.component.html',
  styleUrls: ['./comp-percentage-bar.component.scss']
})
export class CompPercentageBarComponent extends AComponent {

  public sizeIsOK:boolean = false;
  public service:PercentageBarService;

  constructor() {
    super();
    this.service = new PercentageBarService();
    this.logger.enabled = false;
  }

  override onInitialize() {
    this.service.model = this.model;
    this.service.onDataLoaded.subscribe(this.onDataLoaded);
    this.service.loadData(this.route);
  }
  override onChanges() {
    this.service.loadData(this.route);
  }

  private onDataLoaded=(data:any):void=>{
    this.logger.log('**************');
    this.logger.log('CompPercentageBarComponent - onDataLoaded()');
    this.logger.dir(this.route);
    this.logger.dir(this.service.content);
    this.logger.dir(data);
    this.logger.log('**************');

    setTimeout(() => {
      this.update();
    }, 20);
  }

  private update=():void=>{
    this.checkSize();
    this.informParentAboutSize();
  }
  @HostListener('window:resize', ['$event'])
  onHostResize(event:Event){
    this.checkSize();
  }
  public checkSize(){

    this.logger.log('**************');
    this.logger.log('CompPercentageBarComponent - checkSize()');
    this.logger.log('**************');

    const offBar:HTMLElement = document.getElementById('off-bar');
    const offText:HTMLElement = document.getElementById('off-text');

    if(offText==undefined||offBar==undefined){
      return;
    }
    this.sizeIsOK = offBar.offsetWidth>60;

  }


}
