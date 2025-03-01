import {Injectable} from "@angular/core";

@Injectable()

export class LoggerService {

  public enabled:boolean = false;

  constructor() {
    this.enabled = false;
  }

  public log=(str:string):void=>{
    if(this.enabled==false){return;}
     console.log(str);
  }
  public dir=(ob:any):void=>{
    if(this.enabled==false){return;}
     console.dir(ob);
  }
  public error=(str:string):void=>{
    if(this.enabled==false){return;}
     console.error(str);
  }
  public warn=(str:string):void=>{
    if(this.enabled==false){return;}
    console.warn(str);
  }
}
