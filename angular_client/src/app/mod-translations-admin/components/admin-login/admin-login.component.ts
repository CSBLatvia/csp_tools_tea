import {Component, OnDestroy, OnInit} from '@angular/core';

import {LoginService} from '../../services/login.service';
import {LoginVO} from '../../vos/LoginVO';
import {TranslationVO} from "../../../model/vo/TranslationVO";



@Component({
  selector: 'admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit,OnDestroy {

  // text_editor
  // public user:string='text_editor';
  // public password:string='32_Fi8-17Xkd';

  // text_admin
  // public user:string='text_admin';
  // public password:string='Fc_du_923_12Dh';


  public user:string='';
  public password:string='';

  public titleVO:TranslationVO = new TranslationVO('title','tulkojumu rediģēšana','translations editor');
  public labelUserVO:TranslationVO = new TranslationVO('user','lietotāja vārds:','user name:');
  public labelPasswordVO:TranslationVO = new TranslationVO('password','parole:','password:');
  public submitVO:TranslationVO = new TranslationVO('submit','apstiprināt','submit');

  public infoLoadingVO:TranslationVO = new TranslationVO('loading','Uzgaidiet..','Please wait..');
  public infoErrorVO:TranslationVO = new TranslationVO('error','kļūda - pieeja liegta!','error - access denied!');
  public infoSuccessVO:TranslationVO = new TranslationVO('success','Pieslēgšanās veiksmīga!','Connected..');



  public onLoginListener:any;
  public loading:boolean = false;
  public authorized:boolean = false;
  public finished:boolean = false;


  constructor(private service:LoginService) { }

  ngOnInit(): void {
    this.onLoginListener = this.service.onLoginUpdate.subscribe(this.onLoginUpdate);
    this.loading = false;
    this.authorized = false;
    this.finished = false;
  }
  ngOnDestroy(): void {
    this.onLoginListener.unsubscribe();
  }
  public onSubmitClick():void{
    this.loading = true;
    this.authorized = false;
    this.finished = false;
    this.service.login(new LoginVO(this.user,this.password));
  }
  public onLoginUpdate=():void=>{
      this.authorized = this.service.authorized;
      this.loading = false;
      this.finished = true;
  }

}
