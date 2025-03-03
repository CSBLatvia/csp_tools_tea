CREATE OR REPLACE FUNCTION tea.a_generate_percentage_bar(
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
--SELECT tea.a_generate_percentage_bar('lv', 2017, 'w', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_bar('lv', 2017, 'w', 'av', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_bar('lv', 2017, 'h', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_bar('lv', 2017, 'h', 'av', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_bar('lv', 2017, 'w', 'e', 's', 'none', 0, 'all');
--SELECT tea.a_generate_percentage_bar('lv', 2017, 'w', 'av', 's', 'none', 0, 'all');
--SELECT tea.a_generate_percentage_bar('lv', 2017, 'h', 'e', 's', 'none', 0, 'all');
--SELECT tea.a_generate_percentage_bar('lv', 2017, 'h', 'av', 's', 'none', 0, 'all');
--SELECT tea.a_generate_percentage_bar('en', 2017, 'w', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_bar('en', 2017, 'w', 'av', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_bar('en', 2017, 'h', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_bar('en', 2017, 'h', 'av', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_percentage_bar('en', 2017, 'w', 'e', 's', 'none', 0, 'all');
--SELECT tea.a_generate_percentage_bar('en', 2017, 'w', 'av', 's', 'none', 0, 'all');
--SELECT tea.a_generate_percentage_bar('en', 2017, 'h', 'e', 's', 'none', 0, 'all');
--SELECT tea.a_generate_percentage_bar('en', 2017, 'h', 'av', 's', 'none', 0, 'all');

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
      THEN ext_percentage_bar_text_lv
    ELSE ext_percentage_bar_text_en
    END te
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
_sql_main := CONCAT ('WITH b
AS (
  SELECT *
  FROM tea.data
  WHERE year = ', _year, '
    AND level_h = ', _level_h, '
    AND code_h = ''', _code_h, '''
    AND level_w = ', _level_w, '
    AND code_w = ''', _code_w, '''
    AND brdwn = ''', _brdwn, '''
    AND value_code = ''', _value_code, '''
  )
  ,tot
AS (
  SELECT value_ind
  FROM b
  WHERE brdwn_code = ''total''
  )
  ,tot_empl
AS (
  SELECT *
  FROM tea.data
  WHERE year = ', _year, '
    AND level_h = ', _level_h, '
    AND code_h = ''', _code_h, '''
    AND level_w = ', _level_w, '
    AND code_w = ''', _code_w, '''
    AND brdwn = ''', _brdwn, '''
    AND brdwn_code = ''total''
    AND value_code = ''empl''
  )
  ,tot_empl_w
AS (
  SELECT *
  FROM tea.data
  WHERE year = ', _year, '
    AND level_h = ', _level_h, '
    AND code_h = ''', _code_h, '''
    AND level_w = ', _level_w, '
    AND code_w = ''', _code_w, '''
    AND brdwn = ''', _brdwn, '''
    AND brdwn_code = ''total''
    AND value_code = ''empl_w''
  )
  ,d
AS (
  SELECT b.brdwn_code
    ,b.value_ind
    ,ROUND((b.value_ind / tot.value_ind * 100), 1) pct
  FROM b
  JOIN tot ON true
  WHERE b.brdwn_code <> ''total''
    AND b.brdwn = ''sector''
  ORDER BY b.brdwn_code
  )
  ,main
AS (
  SELECT value_ind
    ,brdwn_code
  FROM d
  ORDER BY pct DESC LIMIT 1
  )
SELECT json_strip_nulls(json_build_object(
  ''percentage_bar_set'', json_build_object(
    ''data'', (
      SELECT json_agg(json_build_object(
        ''code'', brdwn_code
        ,''pct'', pct
        ))
      FROM d
      )
    ,''text'', (
      SELECT CONCAT (', _texts_execute.te, ')
      FROM main
      JOIN tot ON true
      LEFT JOIN tot_empl ON true
      LEFT JOIN tot_empl_w ON true
      LEFT JOIN tea.get_territory(''', _year, ''', ''', _t1, ''', ''', _t2, ''') t ON true
      LEFT JOIN tea.meta_value_code m_v_c ON m_v_c.value_code = ''', _value_code, '''
      LEFT JOIN tea.meta_brdwn_code m_b_c ON m_b_c.brdwn_code = main.brdwn_code
      )
    )
  )) r_t;');

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
USING _lang, _year, _level_h, _code_h, _level_w, _code_w, _brdwn, _value_code;

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