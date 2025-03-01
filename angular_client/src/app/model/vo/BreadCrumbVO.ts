import {TranslationVO} from './TranslationVO';

export class BreadCrumbVO{

    public vo:TranslationVO;
    private routeURL:string;
    public route:string;

    private _lang:string;
    private _direction:string;
    private _timeType:string;
    private _timeSTR:string;
    private _countryCode:string;

    constructor(name:TranslationVO, routeURL:string){
        this.vo = name;
        this.routeURL = routeURL;
    }
    public update(lang:string,timeType:string,direction:string, timeSTR:string,countryCode:string):void{
      this._lang = lang;
      this._direction = direction;
      this._timeType = timeType;
      this._timeSTR = timeSTR+'';
      this._countryCode = countryCode;
      this.vo.lang = lang;
      this.route = this.routeURL.replace(':lang',this._lang+'').replace(':timeType',this._timeType+'').replace(':direction',this._direction+'').replace(':timeSTR',this._timeSTR+'').replace(':country',this._countryCode)+'';
    }
    public set lang(value:string){
      this._lang = value;
      this.vo.lang = value;
      this.route = value==='en'?this.route.replace('/lv/','/en/'):this.route.replace('/en/','/lv/');
    }
}
