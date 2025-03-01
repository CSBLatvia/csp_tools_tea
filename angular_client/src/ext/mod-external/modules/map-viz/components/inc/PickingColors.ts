export class PickingColors {
    // maximum color number is 16777215
    // via http://stackoverflow.com/a/15804183
    private nextColor:number=1;
    private step:number = 20; // 10 - previous value
    constructor(){}

    public reset():void{
        this.nextColor = 1;
    }
    public color():string{
        const ret:Array<any> = [];
        if(this.nextColor < 16777215){
            ret.push(this.nextColor & 0xff);               // R
            ret.push((this.nextColor & 0xff00) >> 8);      // G
            ret.push((this.nextColor & 0xff0000) >> 16);   // B
        }
        const col:string = 'rgb(' + ret.join(',') + ')';
        this.nextColor += this.step;
        return col;
    }
}
