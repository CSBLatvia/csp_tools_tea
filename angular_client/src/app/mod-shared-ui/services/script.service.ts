import {Injectable} from '@angular/core';
import {ScriptLoadInfoVO} from './ScriptLoadInfoVO';

@Injectable()
export class ScriptService {

  private scripts:any = {};

  constructor() {

  }


  loadScript(id:string,url:string) {
    return new Promise((resolve, reject) => {
      if (this.scripts[id] && this.scripts[id].loaded === true) {
        resolve(this.scripts[id]);
      } else {
        if(document.getElementById(id) !== null) {
              this.scripts[id] = new ScriptLoadInfoVO(id, url);
              this.scripts[id].loaded = true;
              this.scripts[id].status = 'loaded';
              resolve(this.scripts[id]);
        }else{
                this.scripts[id] = new ScriptLoadInfoVO(id, url);
                const script: any = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                script.id = id;

                if (script.readyState) {  // IE
                  script.onreadystatechange = () => {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                      script.onreadystatechange = null;
                      this.scripts[id].loaded = true;
                      this.scripts[id].status = 'loaded';
                      resolve(this.scripts[id]);
                    }
                  };
                } else {  // other browsers
                  script.onload = () => {
                    this.scripts[id].loaded = true;
                    this.scripts[id].status = 'loaded';
                    resolve(this.scripts[id]);
                  };
                }
                script.onerror = (error: any) => {
                  this.scripts[id].loaded = false;
                  this.scripts[id].status = 'error';
                  resolve(this.scripts[id]);
                };

                document.getElementsByTagName('head')[0].appendChild(script);

              }

      }
    });
  }

}
