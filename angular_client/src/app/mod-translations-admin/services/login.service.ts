import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginVO} from '../vos/LoginVO';


@Injectable()

export class LoginService {

  public onLoginUpdate:EventEmitter<LoginVO> = new EventEmitter<any>();
  private initialized:boolean = false;
  private serviceURL:string='';


  public authorized:boolean = false;
  public user:string='';





  constructor(private http: HttpClient) {
    this.serviceURL = 'https://tools.csb.gov.lv/tea_3/php/translations.php';
    this.initialized = true;
  }

  public login(vo:LoginVO):void{
    this.http.post<any>(this.serviceURL, {data: vo,action:'login' }).subscribe((data:any) => {
      if(data.info==='ok'){
        this.loginDone(data);
      }else{
        this.loginError();
      }
    });
  }
  public loginDone=(data:any):void=>{
    this.authorized = true;
    this.user = data.data.user;
    this.onLoginUpdate.emit();
  }
  public loginError=():void=>{
    this.authorized = false;
    this.onLoginUpdate.emit();
  }
}

