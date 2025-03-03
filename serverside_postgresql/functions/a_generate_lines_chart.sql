CREATE OR REPLACE FUNCTION tea.a_generate_lines_chart(
  _lang text,
  _year integer,
  _m1 text,
  _m2 text,
  _m3 text,
  _m4 text,
  _t1 integer,
  _t2 text)
    RETURNS TABLE(r_t json, debug json) 
    LANGUAGE 'plpgsql'
    COST 1000
    STABLE PARALLEL RESTRICTED 
    ROWS 100

AS $BODY$

--_m1 - darba/dzīves vieta.
--_m2 - rādītājs (darbvietu vai nodarbināto skaits, pievienotā vērtība, produkcijas vērtība).
--_m3 - nozare, profesija vai sektors.
--_m4 - izvēlētā m3 kods.
--_t1 - teritorijas veids (0 - Latvija, 3 - novadi un valstpilsētas, 4 - pagasti un pilsētas, 7 - blīvi apdzīvotas teritorijas).
--_t2 - teritorijas kods atbilstoši teritorijas veidam.

DECLARE _texts_execute RECORD;
_data_execute RECORD;
_level_w INT;
_level_h INT;
_code_w TEXT;
_code_h TEXT;
_level_w_sel INT;
_level_h_sel INT;
_code_w_sel TEXT;
_code_h_sel TEXT;
_value_code_empl TEXT;
--_brdwn TEXT;
--_brdwn_code TEXT;
_value_code TEXT;
_error_msg TEXT;
_error_detail TEXT;
_error_hint TEXT;
_sql_main TEXT;

--Testēšanai.
--SELECT tea.a_generate_lines_chart('lv', 2017, 'w', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_lines_chart('lv', 2017, 'w', 'av', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_lines_chart('lv', 2017, 'h', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_lines_chart('lv', 2017, 'h', 'av', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_lines_chart('lv', 2017, 'w', 'e', 's', 'none', 3, 'all');
--SELECT tea.a_generate_lines_chart('lv', 2017, 'w', 'av', 's', 'none', 3, 'all');
--SELECT tea.a_generate_lines_chart('lv', 2017, 'h', 'e', 's', 'none', 3, 'all');
--SELECT tea.a_generate_lines_chart('lv', 2017, 'h', 'av', 's', 'none', 3, 'all');
--SELECT tea.a_generate_lines_chart('en', 2017, 'w', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_lines_chart('en', 2017, 'w', 'av', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_lines_chart('en', 2017, 'h', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_lines_chart('en', 2017, 'h', 'av', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_lines_chart('en', 2017, 'w', 'e', 's', 'none', 3, 'all');
--SELECT tea.a_generate_lines_chart('en', 2017, 'w', 'av', 's', 'none', 3, 'all');
--SELECT tea.a_generate_lines_chart('en', 2017, 'h', 'e', 's', 'none', 3, 'all');
--SELECT tea.a_generate_lines_chart('en', 2017, 'h', 'av', 's', 'none', 3, 'all');

BEGIN

--Parametru pārveide, lai atbilstu datubāzē izmantotajiem.
/*
_brdwn_code := _m4;

IF _brdwn_code = 'none'
  THEN _brdwn_code := 'total';
END IF;
*/

IF _t2 = 'all'
  THEN _t2 := 'LV';
END IF;

/*
CASE
  WHEN _m3 = 'i'
    THEN _brdwn := 'nace';
  WHEN _m3 = 'p'
    THEN _brdwn := 'prof';
  WHEN _m3 = 's'
    THEN _brdwn := 'sector';
  ELSE _brdwn := 'total';
  /*_error_msg := CONCAT (
    _error_msg
    ,'_m3 vērtības neeksistējošas.'
    );*/
  END CASE;
*/

---Nedefinē mainīgo 100 argumentu limita dēļ.
--_brdwn := 'total';

CASE
  WHEN _m2 = 'av'
    THEN _value_code := 'value_added';
  WHEN _m2 = 'e'
    THEN
      IF _m1 = 'w'
        THEN _value_code := 'empl_w';
      ELSE _value_code := 'empl';
      END IF;
  WHEN _m2 = 'vp'
    THEN _value_code := 'value_prod';
  ELSE
  /*_error_msg := CONCAT (
    _error_msg
    ,'_m2 vērtības neeksistējošas.'
    );*/
  END CASE;

---Home/work parametru apstrāde.
CASE
  WHEN _m1 = 'w'
    AND _t2 = 'LV'
    THEN _level_w := 0;
      _level_h := 99;
      _code_w := _t2;
      _code_h := 'total';
  WHEN _m1 = 'h'
    AND _t2 = 'LV'
    THEN _level_h := 0;
      _level_w := 99;
      _code_h := _t2;
      _code_w := 'total';
  WHEN _m1 = 'w'
    AND _t2 != 'LV'
    THEN _level_w := _t1;
      _level_h := 99;
      _code_w := _t2;
      _code_h := 'total';
  WHEN _m1 = 'h'
    AND _t2 != 'LV'
    THEN _level_h := _t1;
      _level_w := 99;
      _code_h := _t2;
      _code_w := 'total';
  ELSE
  END CASE;

CASE
  WHEN _m1 = 'w'
    THEN
    _value_code_empl = 'empl_w';
  ELSE
    _value_code_empl = 'empl';
  END CASE;

----Home/work parametru apstrāde ārpus teritorijas dzīvojošajiem/strādājošajiem.
CASE 
    WHEN _m1 = 'w'
      THEN _level_w_sel = _level_w;
        _level_h_sel = 99;
        _code_w_sel = _code_w;
        _code_h_sel = 'out';
    WHEN _m1 = 'h'
      THEN _level_w_sel = 99;
        _level_h_sel = _level_h;
        _code_w_sel = 'out';
        _code_h_sel = _code_h;
    ELSE
    END CASE;

--Teksti.
SELECT CASE 
    WHEN _lang = 'lv'
      THEN ext_lines_chart_tab1_lv
    ELSE ext_lines_chart_tab1_en
    END tab1
,CASE 
    WHEN _lang = 'lv'
      THEN ext_lines_chart_tab1_title_lv
    ELSE ext_lines_chart_tab1_title_en
    END tab1_title
,CASE 
    WHEN _lang = 'lv'
      THEN ext_lines_chart_tab1_x_lv
    ELSE ext_lines_chart_tab1_x_en
    END tab1_x
,CASE 
    WHEN _lang = 'lv'
      THEN ext_lines_chart_tab1_y_lv
    ELSE ext_lines_chart_tab1_y_en
    END tab1_y
,CASE 
    WHEN _lang = 'lv'
      THEN ext_lines_chart_tab2_lv
    ELSE ext_lines_chart_tab2_en
    END tab2
,CASE 
    WHEN _lang = 'lv'
      THEN ext_lines_chart_tab2_title_lv
    ELSE ext_lines_chart_tab2_title_en
    END tab2_title
,CASE 
    WHEN _lang = 'lv'
      THEN ext_lines_chart_tab2_x_lv
    ELSE ext_lines_chart_tab2_x_en
    END tab2_x
,CASE 
    WHEN _lang = 'lv'
      THEN ext_lines_chart_tab2_y_lv
    ELSE ext_lines_chart_tab2_y_en
    END tab2_y
,CASE 
    WHEN _lang = 'lv'
      THEN ext_lines_chart_txt_all_lv
    ELSE ext_lines_chart_txt_all_en
    END txt_all
,CASE 
    WHEN _lang = 'lv'
      THEN COALESCE (ext_lines_chart_txt_same_lv, '''''')
    ELSE COALESCE (ext_lines_chart_txt_same_en, '''''')
    END txt_same
,CASE 
    WHEN _lang = 'lv'
      THEN COALESCE (ext_lines_chart_txt_out_lv, '''''')
    ELSE COALESCE (ext_lines_chart_txt_out_en, '''''')
    END txt_out
INTO _texts_execute
FROM tea.texts_title_ext dt
WHERE dt.home_work = _m1
  AND dt.indicator_type = CASE 
    WHEN _m2 = 'e'
      THEN 'empl'
    ELSE 'other'
    END
  AND dt.selected_territ = CASE 
    WHEN _t2 = 'LV'
      THEN 'all'
    ELSE 'selected'
    END;

--Vaicājuma konstruēšana.
_sql_main := CONCAT ('WITH d
AS (
  SELECT a.year
    ,CASE 
      WHEN ''', _m2, ''' = ''e''
        THEN a.value_ind
      ELSE ROUND(a.value_ind / 1000, 0)
      END value_all
    ,CASE 
      WHEN ''', _t2, ''' != ''LV''
        THEN CASE 
            WHEN ''', _m2, ''' = ''e''
              THEN c.value_ind
            ELSE ROUND(c.value_ind / 1000, 0)
            END
      ELSE NULL
      END value_same
    ,CASE 
      WHEN ''', _t2, ''' != ''LV''
        THEN CASE 
            WHEN ''', _m2, ''' = ''e''
              THEN o.value_ind
            ELSE ROUND(o.value_ind / 1000, 0)
            END
      ELSE NULL
      END value_out
    ,CASE 
      WHEN ''', _m2, ''' = ''e''
        THEN ROUND((a.value_ind / NULLIF(b2.value_ind, 0)) * 100, 1)
      ELSE ROUND((a.value_ind / NULLIF(b.value_ind, 0)), 0)
      END value_rel
  FROM tea.data a
  LEFT JOIN tea.data b ON a.year = b.year
    AND b.code_h = ''', _code_h, '''
    AND b.code_w = ''', _code_w, '''
    AND b.value_code = ''', _value_code_empl, '''
    AND b.level_h = ''', _level_h, '''
    AND b.level_w = ''', _level_w, '''
    AND b.brdwn = ''total'' --Nedefinē ar mainīgo 100 argumentu limita dēļ.
  LEFT JOIN tea.data b2 ON a.year = b2.year
    AND b2.code_h = ''', _t2, '''
    AND b2.level_h = CASE 
      WHEN ''', _t2, ''' = ''LV''
        THEN 0
      ELSE ''', _t1, '''
      END
    AND b2.code_w = ''total''
    AND b2.brdwn_code = ''y15y64''
    AND b2.brdwn = ''pop''
  LEFT JOIN tea.data c ON a.year = c.year
    AND c.code_h = ''', _t2, '''
    AND c.level_h = ''', _t1, '''
    AND c.code_w = ''', _t2, '''
    AND c.level_w = ''', _t1, '''
    AND c.value_code = ''', _value_code, '''
    AND c.brdwn = ''total'' --Nedefinē ar mainīgo 100 argumentu limita dēļ.
  LEFT JOIN tea.data o ON a.year = o.year
    AND o.code_h = ''', _code_h_sel, '''
    AND o.level_h = ''', _level_h_sel, '''
    AND o.code_w = ''', _code_w_sel, '''
    AND o.level_w = ''', _level_w_sel, '''
    AND o.value_code = ''', _value_code, '''
    AND o.brdwn = ''total'' --Nedefinē ar mainīgo 100 argumentu limita dēļ.
  WHERE a.code_h = ''', _code_h, '''
    AND a.code_w = ''', _code_w, '''
    AND a.value_code = ''', _value_code, '''
    AND a.level_h = ''', _level_h, '''
    AND a.level_w = ''', _level_w, '''
    AND a.brdwn = ''total'' --Nedefinē ar mainīgo 100 argumentu limita dēļ.
  )
SELECT json_build_object(
  ''lines_chart_set'', json_build_object(
    ''lines_chart_abs'', json_build_object(
        ''tab'', CONCAT (', _texts_execute.tab1, ')
        ,''title'', CONCAT (', _texts_execute.tab1_title, ')
        ,''x'', CONCAT (', _texts_execute.tab1_x, ')
        ,''y'', CONCAT (', _texts_execute.tab1_y, ')
        ,''legend'', CASE
          WHEN ''', _t2, ''' != ''LV''
            THEN json_build_object(
              ''text_all'', CONCAT (', _texts_execute.txt_all, ')
              ,''text_same'', CONCAT (', _texts_execute.txt_same, ')
              ,''text_out'', CONCAT (', _texts_execute.txt_out, ')
              )
          ELSE json_build_object(
            ''text_all'', CONCAT (', _texts_execute.txt_all, ')
            )
          END
        ,''data'', (
          SELECT json_agg(
            CASE
              WHEN ''', _t2, ''' != ''LV''
                THEN json_build_object(
                  ''year'', year
                  ,''value_all'', value_all
                  ,''value_same'', value_same
                  ,''value_out'', value_out
                  )
              ELSE json_build_object(
                ''year'', year
                ,''value_all'', value_all
                )
              END
            )
          FROM d
          )
      ),
    ''lines_chart_rel'', json_build_object(
        ''tab'', CONCAT (', _texts_execute.tab2, ')
        ,''title'', CONCAT (', _texts_execute.tab2_title, ')
        ,''x'', CONCAT (', _texts_execute.tab2_x, ')
        ,''y'', CONCAT (', _texts_execute.tab2_y, ')
        ,''data'', (
          SELECT json_agg(
            json_build_object(
              ''year'', year
              ,''value'', value_rel
              )
            )
          FROM d
        )
      )
    )
  ) r_t
FROM d
LEFT JOIN tea.get_territory(CASE
  WHEN ', _year, ' < 2019
    THEN 2019
  ELSE ', _year, '
  END, ''', _t1, ''', ''', _t2, ''') t ON true
LEFT JOIN tea.meta_value_code m_v_c ON m_v_c.value_code = ''', _value_code, '''');

RAISE NOTICE 'lang = %, year = %, _level_h = %, _code_h = %, _level_w = %, _code_w = %, _value_code = %'
  ,_lang
  ,_year
  ,_level_h
  ,_code_h
  ,_level_w
  ,_code_w
  --,_brdwn
  ,_value_code;

EXECUTE _sql_main
INTO _data_execute
USING _lang
  ,_year
  ,_level_h
  ,_code_h
  ,_level_w
  ,_code_w
  --,_brdwn
  ,_value_code;

RAISE NOTICE 'sql_main: %'
  ,_sql_main;

RETURN query
SELECT _data_execute.r_t r_t
  ,json_build_object('SQL_code', _sql_main) debug;

EXCEPTION
  WHEN OTHERS
    THEN GET STACKED DIAGNOSTICS _error_msg  = MESSAGE_TEXT
      ,_error_detail = PG_EXCEPTION_CONTEXT
      ,_error_hint = PG_EXCEPTION_DETAIL;

RETURN query
SELECT json_build_object('error_msg', _error_msg, 'error_detail', _error_detail, 'error_hint', _error_hint) r_t
  ,json_build_object('SQL_code', _sql_main) debug;

END;
$BODY$;

REVOKE ALL
  ON FUNCTION tea.a_generate_lines_chart(TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT)
  FROM public;