import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})

export class AdminViewComponent implements OnInit,OnDestroy {


  public tableID:number = 0;
  public initialized:boolean = false;
  public authorized:boolean = false;

  constructor(public service:LoginService,private title:Title) { }
  public onTableChoose=(id:number):void=>{
      this.tableID = id;
  }

  ngOnInit(): void {
    this.title.setTitle('translations editor..');
    this.initialize();
  }
  ngOnDestroy(): void {}

  initialize():void{
    if(this.initialized===true){return;}
    this.initialized = true;
  }
}
