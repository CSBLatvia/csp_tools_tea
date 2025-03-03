CREATE OR REPLACE FUNCTION tea.generate_data_table(
  _lang text,
  _reference_period integer,
  _home_work text,
  _indicator_type text,
  _territ_level integer,
  _selected_territ text,
  _indicator_selected text,
  _breakdown_selected text)
    RETURNS TABLE(r_t json, debug text) 
    LANGUAGE 'plpgsql'
    COST 1000
    STABLE PARALLEL RESTRICTED 
    ROWS 100

AS $BODY$

DECLARE _params_all_text_string TEXT;
_return_text_string TEXT;
_data_execute RECORD;
_data_execute_2 RECORD;
_sql_string TEXT;
_level_w INT;
_level_h INT;
_code_w TEXT;
_code_h TEXT;
_brdwn TEXT;
_brdwn_code TEXT;
_value_code TEXT;
_error_msg TEXT;
_error_detail TEXT;
_error_hint TEXT;
_sql_base TEXT;
_sql_main TEXT;
_sql_total TEXT; --Aplim kopējā vērtība.
_sql_divider TEXT; --Dalītājs priekš horopletu kartes.
_hw_mod TEXT;
_hw_div TEXT;
_r_id INT;

--Testēšanai.
--SELECT tea.generate_data_table('lv', 2017, 'w', 'e', 3, 'LV0023000', 's', 'none');
--SELECT tea.generate_data_table('lv', 2017, 'w', 'av', 3, 'LV0023000', 's', 'none');
--SELECT tea.generate_data_table('lv', 2017, 'h', 'e', 3, 'LV0023000', 's', 'none');
--SELECT tea.generate_data_table('lv', 2017, 'h', 'av', 3, 'LV0023000', 's', 'none');
--SELECT tea.generate_data_table('lv', 2017, 'w', 'e', 3, 'all', 's', 'none');
--SELECT tea.generate_data_table('lv', 2017, 'w', 'av', 3, 'all', 's', 'none');
--SELECT tea.generate_data_table('lv', 2017, 'h', 'e', 3, 'all', 's', 'none');
--SELECT tea.generate_data_table('lv', 2017, 'h', 'av', 3, 'all', 's', 'none');
--SELECT tea.generate_data_table('en', 2017, 'w', 'e', 3, 'LV0023000', 's', 'none');
--SELECT tea.generate_data_table('lv', 2017, 'w', 'e', 3, 'LV0023000', 'i', 'none');
--SELECT tea.generate_data_table('lv', 2017, 'w', 'e', 3, 'LV0023000', 'i', 'A');

BEGIN

--Parametru pārveide, lai atbilstu datubāzē izmantotajiem.
_hw_mod := _home_work;
_brdwn_code := _breakdown_selected;

IF _selected_territ = 'all'
  OR _selected_territ = 'none'
  THEN _selected_territ := 'LV';
  --_territ_level := 0;
END IF;

CASE
  WHEN _indicator_selected = 'i'
    THEN _brdwn := 'nace';
  WHEN _indicator_selected = 'p'
    THEN _brdwn := 'prof';
  WHEN _indicator_selected = 's'
    THEN _brdwn := 'sector';
  ELSE _brdwn:='total';
  /*_error_msg := CONCAT (
    _error_msg
    ,'_indicator_selected vērtības neeksistējošas.'
    );*/
  END CASE;

CASE
  WHEN _indicator_type = 'av'
    THEN _value_code := 'value_added';
  WHEN _indicator_type = 'e'
    THEN
      IF _home_work = 'w'
        THEN _value_code := 'empl_w';
      ELSE _value_code := 'empl';
      END IF;
  WHEN _indicator_type = 'vp'
    THEN _value_code := 'value_prod';
  ELSE /*_error_msg := CONCAT(
    _error_msg
    ,'_indicator_type vērtības neeksistējošas.'
    );*/
  END CASE;

---Dalītājs, ja izvēlēti ekonomiskie rādītāji.
IF _home_work = 'w'
  THEN _hw_div := 'empl_w';
ELSE _hw_div := 'empl';
END IF;

---Home/work parametru apstrāde.
CASE
  WHEN _home_work = 'w'
    AND _selected_territ = 'LV'
    THEN _level_w := _territ_level;
      _level_h := 99;
      --_code_w := _selected_territ;
      _code_h := 'total';
  WHEN _home_work = 'h'
    AND _selected_territ = 'LV'
    THEN _level_h := _territ_level;
      _level_w := 99;
      --_code_h := _selected_territ;
      _code_w := 'total';
  WHEN _home_work = 'w'
    AND _selected_territ != 'LV'
    THEN _level_w := _territ_level;
      --_level_h := _territ_level;
      _code_w := _selected_territ;
      _hw_mod := 'h';
  WHEN _home_work = 'h'
    AND _selected_territ != 'LV'
    THEN _level_h := _territ_level;
      --_level_w := _territ_level;
      _code_h := _selected_territ;
      _hw_mod := 'w';
  ELSE
  END CASE;

IF _brdwn_code = 'none'
  THEN _brdwn_code := 'total';
END IF;

--Vaicājuma konstruēšana.
_sql_base := CONCAT ('
    SELECT vd.brdwn
      ,vd.brdwn_code
      ,vd.code_', _hw_mod, ' code
      ,vd.level_', _hw_mod, ' level
      ,vd.year
      ,vd.level_w
      ,vd.code_w
      ,vd.level_h
      ,vd.code_h
      ,vd.value_code
      ,''', _selected_territ, ''' code_sel
      ,vd.value_ind
    FROM tea.data vd
    WHERE vd.year = ', _reference_period, '
      AND vd.value_ind > 0');

---Izvēlēta teritorija vai nav. Izmanto ||, ja kāds ir NULL, tad visa virkne ir NULL.
_sql_base := CONCAT (
  _sql_base
  ,'
      AND vd.level_w = ' || _level_w
  ,'
      AND vd.level_h = ' || _level_h
  ,'
      AND vd.code_w = ''' || _code_w || ''''
  ,'
      AND vd.code_h = ''' || _code_h || ''''
  );

CASE
  ---Ja izvēlēts nodarbināto skaits un nav papildus dalījumu.
  WHEN _indicator_type = 'e'
    AND _indicator_selected = 'none'
    THEN _sql_total := CONCAT (
      _sql_base
      ,'
      AND value_code = ''', _value_code, '''
      AND brdwn = ''', _brdwn, ''''
      );

    IF _brdwn_code = 'total'
      THEN _sql_total := CONCAT (
        _sql_total
        ,'
      AND vd.brdwn_code = ''total'''
        );
    END IF;

    _sql_total := CONCAT (
      _sql_total
      ,'
      AND vd.value_ind > 0'
      );

    ----Pielasa dalītāju. Iedzīvotāju skaitam ir tikai dzīvesvietas kods.
    _sql_divider := CONCAT ('
    SELECT vd.brdwn
      ,vd.brdwn_code
      ,');
  
    _sql_divider := CONCAT (
      _sql_divider
      ,'vd.code_h code
      ,'
      );

    _sql_divider := CONCAT (
      _sql_divider
      ,'vd.level_h level
      ,vd.year
      ,vd.level_w
      ,vd.code_w
      ,vd.level_h
      ,vd.code_h
      ,vd.value_code
      ,''', _selected_territ, ''' code_sel
      ,vd.value_ind
    FROM tea.data vd
    WHERE vd.year = ', _reference_period, '
      AND vd.value_ind > 0');

    ----Ja kāds ir NULL, tad visa virkne ir NULL.
    _sql_divider := CONCAT (
      _sql_divider
      ,'
      AND vd.level_w = 99
      AND vd.level_h = ' || _territ_level, '
      AND vd.code_w = ''total'''
        );

    CASE
      ----Izvēlēta dzīves vieta, bet nav izvēlēta teritorija.
      WHEN _brdwn_code = 'total'
        AND _home_work = 'h'
        AND _selected_territ = 'LV'
        THEN _sql_divider := CONCAT (
          _sql_divider
          ,'
      AND value_code = ''persons''
      AND brdwn = ''pop'''
          );

          _sql_divider := CONCAT (
            _sql_divider
            ,'
      AND vd.brdwn_code = ''y15y64'''
            );

      ----Izvēlēta dzīves vieta un teritorija.
      WHEN _brdwn_code = 'total'
        AND _home_work = 'h'
        AND _selected_territ != 'LV'
        THEN _sql_divider := CONCAT (
          _sql_divider
          ,'
      AND value_code = ''empl''
      AND brdwn = ''total'''
          );

          _sql_divider := CONCAT (
            _sql_divider
            ,'
      AND vd.brdwn_code = ''total'''
            );

          _sql_divider := CONCAT (
            _sql_divider
            ,'
      AND vd.code_h =''', _selected_territ, ''''
            );

      ----Izvēlēta darba vieta, bet nav izvēlēta teritorija.
      WHEN _brdwn_code = 'total'
        AND _home_work = 'w'
        AND _selected_territ = 'LV'
        THEN _sql_divider := CONCAT (
          _sql_divider
          ,'
      AND value_code = ''persons''
      AND brdwn = ''pop'''
          );

          _sql_divider := CONCAT (
            _sql_divider
            ,'
      AND vd.brdwn_code = ''y15y64'''
            );

      ----Izvēlēta darba vieta un teritorija.
      WHEN _brdwn_code = 'total'
        AND _home_work = 'w'
        AND _selected_territ != 'LV'
        THEN _sql_divider := CONCAT (
          _sql_divider
          ,'
      AND value_code = ''empl_w''
      AND brdwn = ''total'''
          );

          _sql_divider := CONCAT (
            _sql_divider
            ,'
      AND vd.brdwn_code = ''total'''
            );

      ELSE _sql_divider := CONCAT (
        _sql_divider
        ,'
      AND value_code = ''persons''
      AND brdwn = ''pop'''
        );
      END CASE;

    _sql_divider := CONCAT (
      _sql_divider
      ,'
      AND vd.value_ind > 0'
      );

    _sql_main := CONCAT ('ta.code
    ,''total'' brdwn_code
    ,ta.value_ind ta_value
    ,ROUND(ta.value_ind / tb.value_ind * 100, 1) tb_value
  FROM (', _sql_total, '
    ) ta
  LEFT JOIN (', _sql_divider, '
    ) tb ');

    CASE
      ----Izvēlēta dzīves vieta, bet nav izvēlēta teritorija.
      WHEN _brdwn_code = 'total'
        AND _home_work = 'h'
        AND _selected_territ != 'LV'
        THEN _sql_main := CONCAT (
          _sql_main
          ,'ON ta.code_h = tb.code_h'
          );

      ELSE _sql_main := CONCAT (
        _sql_main
        ,'ON ta.code=tb.code'
        );
      END CASE;

  ---Ja izvēlēts nodarbināto skaits un izplatītākā nozare.
  WHEN _indicator_type = 'e'
    AND _indicator_selected != 'none'
    AND _breakdown_selected = 'none'
    THEN _sql_total := CONCAT (
      _sql_base
      ,'
      AND value_code = ''', _value_code, '''
      AND brdwn = ''', _brdwn, ''''
      );

      _sql_total := CONCAT (
        _sql_total
        ,'
      AND vd.value_ind > 0'
        );

      ----Pielasa dalītāju. Darba vietu / nodarbināto skaits teritorijā.
      _sql_divider := CONCAT (
        _sql_base
        ,'
      AND value_code = ''', _value_code, '''
      AND brdwn = ''', _brdwn, '''
      AND brdwn_code = ''', _brdwn_code, ''''
        );

      _sql_divider := CONCAT (
        _sql_divider
        ,'
      AND vd.value_ind > 0'
        );

      _sql_main := CONCAT ('ta.code
    ,ta.brdwn_code
    ,ta.value_ind ta_value
    ,ROUND(ta.value_ind / tb.value_ind * 100, 1) tb_value
  FROM (', _sql_total, '
    ) ta
  JOIN (', _sql_divider, '
    ) tb ON ta.code = tb.code');

  ---Ja izvēlēts nodarbināto skaits un konkrēta nozare.
  WHEN _indicator_type = 'e'
    AND _indicator_selected != 'none'
    AND _breakdown_selected != 'none'
    THEN _sql_total := CONCAT (
      _sql_base
      ,'
      AND value_code = ''', _value_code, '''
      AND brdwn = ''', _brdwn, '''
      AND brdwn_code = ''', _brdwn_code, ''''
      );

      _sql_total := CONCAT (
        _sql_total
        ,'
      AND vd.value_ind > 0'
        );

      ----Pielasa dalītāju. Darba vietu / nodarbināto skaits teritorijā.
      _sql_divider := CONCAT (
        _sql_base
        ,'
      AND value_code = ''', _value_code, '''
      AND brdwn = ''', _brdwn, '''
      AND brdwn_code = ''total'''
        );

     _sql_divider := CONCAT (
        _sql_divider
        ,'
      AND vd.value_ind > 0'
        );

      _sql_main := CONCAT ('ta.code
    ,ta.brdwn_code
    ,ta.value_ind ta_value
    ,ROUND(ta.value_ind / tb.value_ind * 100, 1) tb_value
  FROM (', _sql_total, '
    ) ta
  JOIN (', _sql_divider, '
    ) tb ON ta.code = tb.code');

  ---Ja izvēlēta pievienotā / saražotās produkcijas vērtība (nevis nodarbināto skaits) un nav papildus dalījumu.
  WHEN _indicator_type != 'e'
    AND _indicator_selected = 'none'
    THEN _sql_total := CONCAT (
      _sql_base
      ,'
      AND value_code = ''', _value_code, '''
      AND brdwn = ''', _brdwn, '''
      AND brdwn_code = ''', _brdwn_code, ''''
      );

      _sql_total := CONCAT (
        _sql_total
        ,'
      AND vd.value_ind > 0'
        );

      ----Pielasa dalītāju. Darba vietu / nodarbināto skaits nozarē.
      _sql_divider := CONCAT (
        _sql_base
        ,'
      AND value_cod e= ''', _hw_div, '''
      AND brdwn = ''', _brdwn, '''
      AND brdwn_code = ''', _brdwn_code, ''''
        );

      _sql_divider := CONCAT (
        _sql_divider
        ,'
      AND vd.value_ind > 0'
        );

      _sql_main := CONCAT ('ta.code
    ,''total'' brdwn_code
    ,ROUND(ta.value_ind / 1000, 0) ta_value
    ,ROUND(ta.value_ind / tb.value_ind, 0) tb_value
  FROM (', _sql_total, '
    ) ta
  JOIN (', _sql_divider, '
    ) tb ON ta.code = tb.code');

  ---Ja izvēlēta pievienotā / saražotās produkcijas vērtība (nevis nodarbināto skaits) un izplatītākā nozare.
  WHEN _indicator_type != 'e'
    AND _indicator_selected != 'none'
    AND _breakdown_selected = 'none'
    THEN _sql_total := CONCAT (
      _sql_base
      ,'
      AND value_code = ''', _value_code, '''
      AND (
        (
          brdwn = ''', _brdwn, '''
          AND brdwn_code != ''total''
          )
        OR brdwn = ''total''
        )'
      );

      _sql_total := CONCAT (
        _sql_total
        ,'
      AND vd.value_ind > 0'
        );

      ----Pielasa dalītāju. Darba vietu / nodarbināto skaits nozarē.
      _sql_divider := CONCAT (
        _sql_base
        ,'
      AND value_code = ''', _hw_div, '''
      AND (
        (
          brdwn = ''', _brdwn, '''
          AND brdwn_code != ''total''
          )
        OR brdwn = ''total''
        )'
        );

      _sql_divider := CONCAT (
        _sql_divider
        ,'
      AND vd.value_ind > 0'
        );

      _sql_main := CONCAT ('ta.code
    ,ta.brdwn_code
    ,ROUND(ta.value_ind / 1000, 0) ta_value
    ,ROUND(ta.value_ind / tb.value_ind, 0) tb_value
  FROM (', _sql_total, '
    ) ta
  JOIN (', _sql_divider, '
    ) tb ON ta.code = tb.code
    AND ta.brdwn_code = tb.brdwn_code');

  ---Ja izvēlēta pievienotā / saražotās produkcijas vērtība (nevis nodarbināto skaits) un izvēlētā nozare.
  WHEN _indicator_type != 'e'
    AND _indicator_selected != 'none'
    AND _breakdown_selected != 'none'
    THEN _sql_total := CONCAT (
      _sql_base
      ,'
      AND value_code = ''', _value_code, '''
      AND brdwn = ''', _brdwn, '''
      AND brdwn_code = ''', _brdwn_code, ''''
      );

      _sql_total := CONCAT (
        _sql_total
        ,'
      AND vd.value_ind > 0'
        );

      ----Pielasa dalītāju. Darba vietu / nodarbināto skaits nozarē.
      _sql_divider := CONCAT (
        _sql_base
        ,'
      AND value_code = ''', _hw_div, '''
      AND brdwn = ''', _brdwn, '''
      AND brdwn_code = ''', _brdwn_code, ''''
        );

      _sql_divider := CONCAT (
        _sql_divider
        ,'
      AND vd.value_ind > 0'
        );

      _sql_main := CONCAT ('ta.code
    ,ta.brdwn_code
    ,ROUND(ta.value_ind / 1000, 0) ta_value
    ,ROUND(ta.value_ind / tb.value_ind, 0) tb_value
  FROM (', _sql_total, '
    ) ta
  JOIN (', _sql_divider, '
    ) tb ON ta.code = tb.code
    AND ta.brdwn_code = tb.brdwn_code');

  ELSE
  END CASE;

---Saformē līdz galam vaicājumu.
_sql_main := CONCAT('WITH base
AS (
  SELECT sort_code
    ,name_', _lang, ' name
    ,', _sql_main, '
  JOIN (
    SELECT LEFT(name_en, 3) sort_code
      ,code
      ,name_lv
      ,name_en
    FROM tea.get_territories_table(', _territ_level, ', 2017)
    
    UNION ALL
    
    SELECT ''1_total''
      ,''total''
      ,''Pavisam''
      ,''Total''
    
    UNION ALL
    
    SELECT ''2_out''
      ,''out''
      ,''Ārpus teritorijas''
      ,''Outside teritory''
    
    UNION ALL
    
    SELECT ''w_conf''
      ,''CONF''
      ,''Konfidenciāli dati''
      ,''Confidential data''
    
    UNION ALL
    
    SELECT ''w_corr''
      ,''CORR''
      ,''Korekcijas''
      ,''Corrections''
    
    UNION ALL
    
    SELECT ''w_unk''
      ,''UNK''
      ,''Nezināma teritorija''
      ,''Unknown territory''
    ) tc ON ta.code = tc.code
  )');

----Pieliek JSON veidojošo daļu.
-----Top.
IF _indicator_selected != 'none'
  AND _breakdown_selected = 'none'
  THEN _sql_main := CONCAT (
    _sql_main
    ,'
SELECT json_build_object(
  ''data'', json_agg(json_build_object(
    ''sort_code'', o.sort_code
    ,''code'', o.code
    ,''name'', o.name
    ,''property_id'', o.brdwn_code
    ,''value'', o.ta_value
    ,''value_calc'', o.tb_value
    ,''data_ter'', inn.json_in
    ))
  ) r_t
FROM base o
LEFT JOIN (
  SELECT code
    ,json_agg(json_build_object(
      ''property_id'', brdwn_code
      ,''value'', ta_value
      ,''value_calc'', tb_value
      )) json_in
  FROM base
  WHERE brdwn_code != ''total''
  GROUP BY code
  ) inn ON o.code = inn.code
WHERE o.brdwn_code = ''total'''
    );

-----Kopā vai izvēlēta konkrēta nozare/profesija/sektors.
ELSE _sql_main := CONCAT (
  _sql_main
  ,'
SELECT json_build_object(
  ''data'', json_agg(json_build_object(
    ''sort_code'', o.sort_code
    ,''code'', o.code
    ,''name'', o.name
    ,''property_id'', o.brdwn_code
    ,''value'', o.ta_value
    ,''value_calc'', o.tb_value
    ,''data_ter'', NULL::json
    ))
  ) r_t
FROM base o'
  );
END IF;

/*
RAISE NOTICE 'sql_main: %', _sql_main;
RAISE NOTICE 'sql_divider: %', _sql_divider;
RAISE NOTICE 'sql_total: %', _sql_total;
*/

EXECUTE _sql_main
INTO _data_execute;
/*USING _reference_period
  ,_level_w
  ,_level_h
  ,_code_w
  ,_code_h
  ,_value_code
  ,_brdwn
  ,_brdwn_code;*/

RETURN query
SELECT _data_execute.r_t r_t
  ,_sql_main debug;

EXCEPTION
  WHEN OTHERS
    THEN GET STACKED DIAGNOSTICS _error_msg  = MESSAGE_TEXT
      ,_error_detail = PG_EXCEPTION_CONTEXT
      ,_error_hint = PG_EXCEPTION_DETAIL;

RETURN query
SELECT json_build_object('error_msg', _error_msg, 'error_detail', _error_detail, 'error_hint', _error_hint) r_t
  ,CONCAT(
    'SQL_code:'
    ,_sql_main
    ) debug;

END;
$BODY$;

REVOKE ALL
  ON FUNCTION tea.generate_data_table(TEXT, INTEGER, TEXT, TEXT, INTEGER, TEXT, TEXT, TEXT)
  FROM public;