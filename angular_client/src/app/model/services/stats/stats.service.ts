import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Config} from "../../Config";
import {MetaUpdateService} from "../meta-update/meta-update.service";
import {IModel} from "../../IModel";

@Injectable()


export class StatsService {

  public model:IModel;
  public meta:MetaUpdateService;
  public config:Config;

  constructor(private router:Router) { }

  public initialize(model:IModel,meta:MetaUpdateService){
    this.model = model;
    this.meta = meta;
  }
  public sendStats(search:boolean = false,searchString:string='', searchResults:number=0):void{

    if(!(<any>window)._paq) {
      //// console.error("StatsService - error - window doesn't exist");
      return;
    }
    if(this.meta.initialized==false) {
      //// console.error("StatsService - error - MetaUpdate isn't initialized");
      return;
    }
    if(this.model.READY==false) {
      //// console.error("StatsService - error - ModelService isn't initialized");
      return;
    }


    const routeURL:string = this.router.url;
    const pageTitle:string = this.meta.title.getTitle()||'no title...';

    if((<any>window)._paq) {

      if(search==false){

        (<any>window)._paq.push(['setCustomUrl',this.model.config.hostName+routeURL]);
        (<any>window)._paq.push(['setDocumentTitle', pageTitle]);
        (<any>window)._paq.push(['trackPageView']);
      }
      if(search==true && searchString!==''){

          (<any>window)._paq.push(['trackSiteSearch',
            // Search keyword searched for
            searchString,
            // Search category selected in your search engine. If you do not need this, set to false
            false,
            // Number of results on the Search results page. Zero indicates a 'No Result Search Keyword'. Set to false if you don't know
            searchResults
          ]);

      }
    }



  }
}
