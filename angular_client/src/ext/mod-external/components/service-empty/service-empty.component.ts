import {Component, Input} from '@angular/core';
import {ComponentServiceEmptyVO} from "../../services/ComponentServiceEmptyVO";

@Component({
  selector: 'service-empty',
  templateUrl: './service-empty.component.html',
  styleUrls: ['./service-empty.component.scss']
})
export class ServiceEmptyComponent {
  @Input() data:ComponentServiceEmptyVO;
  public open:boolean = false;

  public openWindow(){
    this.open = true;
  }
  public closeWindow(){
    this.open = false;
  }
}
