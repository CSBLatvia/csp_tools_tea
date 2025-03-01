import {Component, ViewEncapsulation} from '@angular/core';
import {TranslationVO} from '../model/vo/TranslationVO';
import {Location} from '@angular/common';
import {AViewSecond} from "../model/AViewSecond";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-iframe-view',
  templateUrl: './iframe-view.component.html',
  styleUrls: ['./iframe-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IframeViewComponent extends AViewSecond{


  public titleVO:TranslationVO;
  public descriptionVO:TranslationVO;
  public buttonBack:TranslationVO;
  public codeSnippet:string;
  public iFrameCodeSnippet:string;

  public url:string='';
  public urlEmbed:string='';
  public HOST:string =  environment.host;

  constructor(private location:Location) {
    super();
  }

  override onChanges():void{
    super.onChanges();
    this.updateTitleVOS();
  }

  private updateTitleVOS=():void=>{
    this.titleVO = this.model.translations.item('embed-view-title');
    this.descriptionVO = this.model.translations.item('embed-view-description');
    this.buttonBack = this.model.translations.item('about-view-close');
    this.titleVO.lang = this.route.lang;
    this.descriptionVO.lang = this.route.lang;
    this.buttonBack.lang = this.route.lang;
    this.changeURLSByLang();
  }
  private changeURLSByLang():void{

    this.url = this.HOST+'/'+this.route.lang+'/compare/2022/workplace/number-of-workplaces/territories-4/LV0023200/none/none/va_wp/empl_wp_100';
    this.urlEmbed=this.HOST+'/external/'+this.route.lang+'/ext-scatter-plot/2022/workplace/number-of-workplaces/territories-4/LV0023200/none/none/va_wp/empl_wp_100/log_lin?dom=04731ba4-7f77-40ca-a415-bd199d4e16ab';

    this.codeSnippet = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Iframe example</title>
</head>
<body>

<iframe
  id="04731ba4-7f77-40ca-a415-bd199d4e16ab"
  src="[url_embed]"
></iframe>


</body>
</html>
`;
    this.iFrameCodeSnippet = `
<iframe
    id="f9434e67-bf2f-499e-9bc4-d939c2ddc5bc"
    width="100%"
    src="[url_embed]"
></iframe>
`;

    this.codeSnippet = this.codeSnippet.replace('[url_embed]',this.urlEmbed);
  }
  public close=():void=>{
    this.location.back();
  }



}
