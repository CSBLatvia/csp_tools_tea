import {Component, Input} from '@angular/core';
import {ComponentServiceErrorVO} from "../../services/ComponentServiceErrorVO";


@Component({
  selector: 'service-error',
  templateUrl: './service-error.component.html',
  styleUrls: ['./service-error.component.scss']
})

export class ServiceErrorComponent {

  @Input() data:ComponentServiceErrorVO;
  public open:boolean = false;

  public openWindow(){
    this.open = true;
  }
  public closeWindow(){
    this.open = false;
  }

}
