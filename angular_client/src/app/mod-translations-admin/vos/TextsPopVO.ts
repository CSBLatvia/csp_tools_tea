export class TextsPopVO{

  public p_id:string;
  public home_work:string;
  public indicator_type:string;
  public selected_territ:string;
  public indicator_selected:string;

  public breakdown_selected:string;
  public request_type:string;
  public text_display_lv:string;
  public text_display_en:string;
  public sql_string_from_join:string;
  public sql_string_where:string;


  constructor(
      p_id:string,
      home_work:string,
      indicator_type:string,
      selected_territ:string,
      indicator_selected:string,
      breakdown_selected:string,
      request_type:string,
      text_display_lv:string,
      text_display_en:string,
      sql_string_from_join:string,
      sql_string_where:string
  ) {
      this.p_id = p_id;
      this.home_work = this.checkNull(home_work);
      this.indicator_type = this.checkNull(indicator_type);
      this.selected_territ = this.checkNull(selected_territ);
      this.indicator_selected = this.checkNull(indicator_selected);

      this.breakdown_selected = this.checkNull(breakdown_selected);
      this.request_type = this.checkNull(request_type);
      this.text_display_lv = this.checkNull(text_display_lv);
      this.text_display_en = this.checkNull(text_display_en);
      this.sql_string_from_join = this.checkNull(sql_string_from_join);
      this.sql_string_where = this.checkNull(sql_string_where);
  }

  public clone(){
    const vo:TextsPopVO = new TextsPopVO(
      this.p_id,
      this.home_work ,
      this.indicator_type ,
      this.selected_territ ,
      this.indicator_selected ,

      this.breakdown_selected ,
      this.request_type ,
      this.text_display_lv ,
      this.text_display_en ,
      this.sql_string_from_join ,
      this.sql_string_where
    );
    return vo;
  }
  public checkNull=(value:any):string=>{
    return value==null?'':value+'';
  }
}
