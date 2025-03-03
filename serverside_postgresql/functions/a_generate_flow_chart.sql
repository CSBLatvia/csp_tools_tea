CREATE OR REPLACE FUNCTION tea.a_generate_flow_chart(
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
_value_code_empl TEXT;
_brdwn TEXT;
--_brdwn_code TEXT;
_value_code TEXT;
_error_msg TEXT;
_error_detail TEXT;
_error_hint TEXT;
_sql_main TEXT;
_pct INT;

--Testēšanai.
--SELECT tea.a_generate_flow_chart('lv', 2017, 'w', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_flow_chart('lv', 2017, 'h', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_flow_chart('en', 2017, 'w', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_flow_chart('en', 2017, 'h', 'e', 's', 'none', 3, 'LV0023000');

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

_brdwn := 'total';

/*
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
*/

_value_code := 'empl';

---Home/work parametru apstrāde.
CASE
  WHEN _m1 = 'w'
    AND _t2 != 'LV'
    THEN _level_w := _t1;
      _level_h := _t1;
      _code_w := _t2;
      --_code_h := _t2;
  WHEN _m1 = 'h'
    AND _t2 != 'LV'
    THEN _level_h := _t1;
      _level_w := _t1;
      _code_h := _t2;
      --_code_w := _t2;
  ELSE
  END CASE;

--Teksti.
SELECT CASE 
    WHEN _lang = 'lv'
      THEN COALESCE (dt.ext_flow_chart_title_lv, '''''')
    ELSE COALESCE (dt.ext_flow_chart_title_en, '''''')
    END title
,CASE 
    WHEN _lang = 'lv'
      THEN COALESCE (dt.ext_flow_chart_txt_lv, '''''')
    ELSE COALESCE (dt.ext_flow_chart_txt_en, '''''')
    END txt
,CASE 
    WHEN _lang = 'lv'
      THEN COALESCE (dt.ext_flow_chart_others_lv, '''''')
    ELSE COALESCE (dt.ext_flow_chart_others_en, '''''')
    END others
,CASE 
    WHEN _lang = 'lv'
      THEN tr1.lv
    ELSE tr1.en
    END work
,CASE 
    WHEN _lang = 'lv'
      THEN tr2.lv
    ELSE tr2.en
    END home
INTO _texts_execute
FROM tea.texts_title_ext dt
JOIN tea.translations tr1 ON true
  AND tr1.variable_name = 'm1-value-1'
JOIN tea.translations tr2 ON true
  AND tr2.variable_name = 'm1-value-2'
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
  
---Īpatsvars procentos, pie kura apvieno zem citiem.
_pct := 2;
  
--Vaicājuma konstruēšana.
_sql_main := CONCAT ('WITH c
AS (
  SELECT CASE 
      WHEN ''', _m1, ''' = ''w''
        THEN code_h
      ELSE code_w
      END code
    ,value_ind
  FROM tea.data
  WHERE (
      (
        ''', _m1, ''' = ''w''
        AND code_w = ''', _code_w, '''
        AND code_h != ''', _code_w, '''
        )
      OR (
        ''', _m1, ''' = ''h''
        AND code_h = ''', _code_h, '''
        AND code_w != ''', _code_h, '''
        )
      )
    AND year = ''', _year, '''
    AND value_code = ''', _value_code, '''
    AND level_h = ''', _level_h, '''
    AND level_w = ''', _level_w, '''
    AND brdwn = ''', _brdwn, '''
  )
  ,total
AS (
  SELECT CONCAT (', _texts_execute.txt ,') name
    ,SUM(c.value_ind) total_value
  FROM c
  LEFT JOIN tea.get_territory(''', _year, ''', ''', _t1, ''', ''', _t2, ''') t ON true
  GROUP BY name
  )
  ,data
AS (
  SELECT CASE 
      WHEN ''', _lang, ''' = ''lv''
        THEN t.name_lv_short
      ELSE t.name_en_short
      END name
    ,SUM(c.value_ind) value
  FROM c
  LEFT JOIN tea.get_territory(''', _year, ''', ''', _t1, ''', code) t ON true
  GROUP BY name
  )
  ,data1
AS (
  SELECT CASE 
      WHEN m.name IS NULL
        THEN CONCAT (', _texts_execute.others ,')
      ELSE m.name
      END name
    ,m.value value
    ,ROUND(m.value / tot.total_value * 100, 1) pct
  FROM data m
  JOIN total tot ON true
  )
  ,data2
AS (
  SELECT CASE 
      WHEN pct < ''', _pct, '''
        THEN CONCAT (', _texts_execute.others ,')
      ELSE name
      END name
    ,SUM(value) value
    ,SUM(pct) pct
  FROM data1
  GROUP BY CASE 
      WHEN pct < ''', _pct, '''
        THEN CONCAT (', _texts_execute.others ,')
      ELSE name
      END
  ORDER BY value DESC
  )
  ,main_data
AS (
  SELECT json_agg(json_build_object(
    ''name'', name
    ,''value'', value
    ,''pct'', pct
    )) main_array
  FROM data2
  )
  ,tot_data
AS (
  SELECT json_agg(json_build_object(
    ''name'', name
    ,''value'', total_value
    )) tot_array
  FROM total
  )
SELECT json_build_object(
  ''flow_chart_set'', json_build_object(
    ''title'', CONCAT (', _texts_execute.title, ')
    ,''data'', 
      CASE 
        WHEN ''', _m1, ''' = ''w''
          THEN json_build_object(
            ''h'', json_build_object(
              ''name'', ''', _texts_execute.home, '''
              ,''data'', (SELECT main_array FROM main_data)
              )
            ,''w'', json_build_object(
              ''name'', ''', _texts_execute.work, '''
              ,''data'', (SELECT tot_array FROM tot_data)
              )
            )
        ELSE json_build_object(
          ''h'', json_build_object(
            ''name'', ''', _texts_execute.home, '''
            ,''data'', (SELECT tot_array FROM tot_data)
            )
          ,''w'', json_build_object(
            ''name'', ''', _texts_execute.work, '''
            ,''data'', (SELECT main_array FROM main_data)
            )
          )
        END
    )
  ) r_t
FROM c
LEFT JOIN tea.get_territory(''', _year, ''', ''', _t1, ''', ''', _t2, ''') t ON true
LEFT JOIN tea.meta_value_code m_v_c ON m_v_c.value_code = ''', _value_code, '''
--LEFT JOIN tea.meta_brdwn_code m_b_c ON m_b_c.brdwn_code = c.brdwn_code
;');

RAISE NOTICE 'lang = %, year = %, _level_h = %, _code_h = %, _level_w = %, _code_w = %, _brdwn = %, _value_code = %'
  ,_lang
  ,_year
  ,_level_h
  ,_code_h
  ,_level_w
  ,_code_w
  ,_brdwn
  ,_value_code;

EXECUTE _sql_main
INTO _data_execute
USING _lang
  ,_year
  ,_level_h
  ,_code_h
  ,_level_w
  ,_code_w
  ,_brdwn
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
  ON FUNCTION tea.a_generate_flow_chart(TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT)
  FROM public;