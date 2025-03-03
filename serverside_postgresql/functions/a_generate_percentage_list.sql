CREATE OR REPLACE FUNCTION tea.a_generate_percentage_list(
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
_level_w_same_t2 INT;
_level_h_same_t2 INT;
_code_w_same_t2 TEXT;
_code_h_same_t2 TEXT;
_code_w_out TEXT;
_code_h_out TEXT;
_brdwn TEXT;
_brdwn_code TEXT;
_value_code TEXT;
_error_msg TEXT;
_error_detail TEXT;
_error_hint TEXT;
_sql_main TEXT;

--Testēšanai.
--SELECT tea.a_generate_percentage_list('lv', 2017, 'w', 'e', 'i', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_list('lv', 2017, 'w', 'av', 'i', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_list('lv', 2017, 'h', 'e', 'i', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_list('lv', 2017, 'h', 'av', 'i', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_list('lv', 2017, 'w', 'e', 'i', 'none', 0, 'all');
--SELECT tea.a_generate_percentage_list('lv', 2017, 'w', 'av', 'i', 'none', 0, 'all');
--SELECT tea.a_generate_percentage_list('lv', 2017, 'h', 'e', 'i', 'none', 0, 'all');
--SELECT tea.a_generate_percentage_list('lv', 2017, 'h', 'av', 'i', 'none', 0, 'all');
--SELECT tea.a_generate_percentage_list('en', 2017, 'w', 'e', 'i', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_list('en', 2017, 'w', 'av', 'i', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_list('en', 2017, 'h', 'e', 'i', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_list('en', 2017, 'h', 'av', 'i', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_list('en', 2017, 'w', 'e', 'i', 'none', 0, 'all');
--SELECT tea.a_generate_percentage_list('en', 2017, 'w', 'av', 'i', 'none', 0, 'all');
--SELECT tea.a_generate_percentage_list('en', 2017, 'h', 'e', 'i', 'none', 0, 'all');
--SELECT tea.a_generate_percentage_list('en', 2017, 'h', 'av', 'i', 'none', 0, 'all');

BEGIN

--Parametru pārveide, lai atbilstu datubāzē izmantotajiem.
_brdwn_code := _m4;

IF _brdwn_code = 'none'
  THEN _brdwn_code := 'total';
END IF;

IF _t2 = 'all'
  THEN _t2 := 'LV';
END IF;

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

----Home/work parametru apstrāde tās pašas teritorijas iedzīvotājiem/nodarbinātajiem.
CASE
  WHEN _m1 = 'w'
    THEN _level_w_same_t2 = _level_w;
      _level_h_same_t2 = _level_w;
      _code_w_same_t2 = _code_w;
      _code_h_same_t2 = _code_w;
  ELSE _level_w_same_t2 = _level_h;
    _level_h_same_t2 = _level_h;
    _code_w_same_t2 = _code_h;
    _code_h_same_t2 = _code_h;
  END CASE;

----Home/work parametru apstrāde ārpus teritorijas dzīvojošajiem/strādājošajiem.
CASE
  WHEN _m1 = 'w'
    THEN
    _code_w_out = _code_w;
    _code_h_out = 'out';
  ELSE
    _code_w_out = 'out';
    _code_h_out = _code_h;
  END CASE;

--Teksti.
SELECT CASE 
    WHEN _lang = 'lv'
      THEN ext_percentage_list_title_lv
    ELSE ext_percentage_list_title_en
    END title
  ,CASE 
    WHEN _lang = 'lv'
      THEN ext_percentage_list_all_lv
    ELSE ext_percentage_list_all_en
    END "all"
  ,CASE 
    WHEN _lang = 'lv'
      THEN ext_percentage_list_same_lv
    ELSE ext_percentage_list_same_en
    END same
  ,CASE 
    WHEN _lang = 'lv'
      THEN ext_percentage_list_out_lv
    ELSE ext_percentage_list_out_en
    END "out"
  ,CASE 
    WHEN _lang = 'lv'
      THEN ext_percentage_list_table_col_2_title_lv
    ELSE ext_percentage_list_table_col_2_title_en
    END table_col_2_title
  ,CASE 
    WHEN _lang = 'lv'
      THEN ext_percentage_list_table_col_3_title_lv
    ELSE ext_percentage_list_table_col_3_title_en
    END table_col_3_title
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
_sql_main := CONCAT ('WITH main
AS (
  SELECT ''all'' part
    ,*
  FROM tea.data
  WHERE year = ', _year, '
    AND level_h = ', _level_h, '
    AND code_h = ''', _code_h, '''
    AND level_w = ', _level_w, '
    AND code_w = ''', _code_w, '''
    AND brdwn = ''', _brdwn, '''
    AND value_code = ''', _value_code, '''
  
  UNION
  
  SELECT ''out'' part
    ,*
  FROM tea.data
  WHERE year = ', _year, '
    AND level_h = ', _level_h, '
    AND code_h = ''', _code_h_out, '''
    AND level_w = ', _level_w, '
    AND code_w = ''', _code_w_out, '''
    AND brdwn = ''', _brdwn, '''
    AND value_code = ''', _value_code, '''
  
  UNION
  
  SELECT ''same'' part
    ,*
  FROM tea.data
  WHERE year = ', _year, '
    AND level_h = ', _level_h_same_t2, '
    AND code_h = ''', _code_h_same_t2, '''
    AND level_w = ', _level_w_same_t2, '
    AND code_w = ''', _code_w_same_t2, '''
    AND brdwn = ''', _brdwn, '''
    AND value_code = ''', _value_code, '''
  )
  ,d
AS (
  SELECT main.part
    ,CASE 
      WHEN ''', _lang, ''' = ''lv''
        THEN m_b_c.name_lv
      ELSE m_b_c.name_en
      END name
    ,CASE
      WHEN ''', _m2, ''' = ''e''
        THEN main.value_ind
      ELSE ROUND(main.value_ind / 1000, 0)
      END value_ind
    ,ROUND(main.value_ind / tt_rel.value_ind * 100, 1) pct
    ,CONCAT (', _texts_execute.title, ') title
    ,CONCAT (', _texts_execute."all", ') "all"
    ,CONCAT (', _texts_execute.same, ') same
    ,CONCAT (', _texts_execute."out", ') "out"
    ,CONCAT (', _texts_execute.table_col_2_title, ') table_col_2_title
    ,CONCAT (', _texts_execute.table_col_3_title, ') table_col_3_title
  FROM main
  INNER JOIN main tt_rel ON main.part = tt_rel.part
  LEFT JOIN tea.meta_brdwn_code m_b_c ON main.brdwn = m_b_c.brdwn
    AND main.brdwn_code = m_b_c.brdwn_code
  LEFT JOIN tea.meta_value_code m_v_c ON main.value_code = m_v_c.value_code
  LEFT JOIN tea.get_territory(main.year, ''', _t1, ''', ''', _t2, ''') t ON true
  WHERE main.brdwn_code != ''total''
    AND tt_rel.brdwn_code = ''total''
    AND main.value_ind > 0
  ORDER BY value_ind DESC
  )
SELECT json_strip_nulls(json_build_object(
  ''percentage_list_set'', json_build_object(
    ''title'', (
      SELECT d.title
      FROM d LIMIT 1
      )
    ,''percentage_list_all'', json_build_object(
      ''tab_title'', (
        SELECT d."all"
        FROM d
        WHERE part = ''all'' LIMIT 1
        )
      ,''columns'', json_build_object(
        ''table_col_2_title'', (
          SELECT table_col_2_title
          FROM d
          WHERE part = ''all'' LIMIT 1
          )
        ,''table_col_3_title'', (
          SELECT table_col_3_title
          FROM d
          WHERE part = ''all'' LIMIT 1
          )
        )
      ,''data'', (
        SELECT json_agg(json_build_object(
          ''name'', name
          ,''value'', value_ind
          ,''pct'', pct
        ))
        FROM d
        WHERE part = ''all''
        )
      )
    ,''percentage_list_same'', json_build_object(
      ''tab_title'', (
        SELECT d.same
        FROM d
        WHERE part = ''same'' LIMIT 1
        )
      ,''columns'', json_build_object(
        ''table_col_2_title'', (
          SELECT table_col_2_title
          FROM d
          WHERE part = ''same'' LIMIT 1
          )
        ,''table_col_3_title'', (
          SELECT table_col_3_title
          FROM d
          WHERE part = ''same'' LIMIT 1
          )
        )
      ,''data'', (
        SELECT json_agg(json_build_object(
          ''name'', name
          ,''value'', value_ind
          ,''pct'', pct
          ))
        FROM d
        WHERE part = ''same''
        )
      )
    ,''percentage_list_out'', json_build_object(
      ''tab_title'', (
        SELECT d."out"
        FROM d
        WHERE part = ''out'' LIMIT 1
        )
      ,''columns'', json_build_object(
        ''table_col_2_title'', (
          SELECT table_col_2_title
          FROM d
          WHERE part = ''out'' LIMIT 1
          )
        ,''table_col_3_title'', (
          SELECT table_col_3_title
          FROM d
          WHERE part = ''out'' LIMIT 1
          )
        )
      ,''data'', (
        SELECT json_agg(json_build_object(
          ''name'', name
          ,''value'', value_ind
          ,''pct'', pct
          ))
        FROM d
        WHERE part = ''out''
        )
      )
    )
  )) r_t');

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
  ON FUNCTION tea.a_generate_percentage_list(TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT)
  FROM public;