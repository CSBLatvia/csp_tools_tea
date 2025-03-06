CREATE OR REPLACE FUNCTION tea.a_generate_map_viz(
  _lang text,
  _year integer,
  _m1 text,
  _m2 text,
  _m3 text,
  _m4 text,
  _t1 integer,
  _t2 text,
  _gvf numeric DEFAULT 0.95)
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

DECLARE _params_all_text_string TEXT;
_return_text_string TEXT;
_data_execute record;
_data_execute_2 record;
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
_sql_main TEXT;
_sql_top TEXT; --Top 7 profesijas/NACE vai izvēlētā.
_sql_total TEXT; --Aplim kopējā vērtība.
_sql_sector TEXT; --Aplim sektora vērtība.
_sql_divider TEXT; --Dalītājs priekš horopletu kartes.
_sql_final TEXT;
_hw_mod TEXT;
_r_id int;

--Testēšanai.
--SELECT tea.a_generate_map_viz('lv', 2017, 'w', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_viz('lv', 2017, 'w', 'av', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_viz('lv', 2017, 'h', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_viz('lv', 2017, 'h', 'av', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_viz('lv', 2017, 'w', 'e', 's', 'none', 3, 'all');
--SELECT tea.a_generate_map_viz('lv', 2017, 'w', 'av', 's', 'none', 3, 'all');
--SELECT tea.a_generate_map_viz('lv', 2017, 'h', 'e', 's', 'none', 3, 'all');
--SELECT tea.a_generate_map_viz('lv', 2017, 'h', 'av', 's', 'none', 3, 'all');
--SELECT tea.a_generate_map_viz('en', 2017, 'w', 'e', 's', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_viz('lv', 2017, 'w', 'e', 'i', 'none', 3, 'LV0023000');
--SELECT tea.a_generate_map_viz('lv', 2017, 'w', 'e', 'i', 'A', 3, 'LV0023000');

BEGIN

--Parametru pārveide, lai atbilstu datubāzē izmantotajiem.
_hw_mod := _m1;
_brdwn_code := _m4;


IF _t2 = 'all'
  THEN _t2:='LV';
  --_t1 := 0;
END IF;

CASE
  WHEN _m3 = 'i'
    THEN _brdwn := 'nace';
  WHEN _m3='p'
    THEN _brdwn := 'prof';
  WHEN _m3 = 's'
    THEN _brdwn := 'sector';
  ELSE _brdwn:='total';
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
    THEN _level_w := _t1;
      _level_h := 99;
      --_code_w := _t2;
      _code_h := 'total';
  WHEN _m1 = 'h'
    AND _t2 = 'LV'
    THEN _level_h := _t1;
      _level_w := 99;
      --_code_h := _t2;
      _code_w := 'total';
  WHEN _m1 = 'w'
    AND _t2 != 'LV'
    THEN _level_w := _t1;
      --_level_h := _t1;
      _code_w := _t2;
      _hw_mod := 'h';
  WHEN _m1 = 'h'
    AND _t2 != 'LV'
    THEN _level_h := _t1;
      --_level_w := _t1;
      _code_h := _t2;
      _hw_mod := 'w';
  ELSE
  END CASE;

IF _brdwn_code = 'none'
  THEN _brdwn_code := 'total';
END IF;

--Vaicājuma konstruēšana.
---Apļa kopējās vērtības atlase.
_sql_total := CONCAT ('SELECT vd.brdwn
    ,vd.brdwn_code
    ,vd.code_', _hw_mod, ' code
    ,vd.level_', _hw_mod, ' level
    ,vd.year
    ,vd.level_w
    ,vd.code_w
    ,vd.level_h
    ,vd.code_h
    ,vd.value_code
    ,''', _t2, ''' code_sel
    ,vd.value_ind
  FROM tea.data vd
  WHERE vd.year = ', _year, '
    AND vd.value_ind > 0'
  );

----Ja kāds ir NULL, tad visa virkne ir NULL.
_sql_total := CONCAT (
  _sql_total
  ,'
    AND vd.level_w = ' || _level_w
  ,'
    AND vd.level_h = ' || _level_h
  ,'
    AND vd.code_w = ''' || _code_w || ''''
  ,'
    AND vd.code_h = ''' || _code_h || ''''
  );

_sql_total := CONCAT (
  _sql_total
  ,'
    AND value_code = ''', _value_code, '''
    AND brdwn = ''', _brdwn, '''
    AND vd.brdwn_code = ''total''
    AND vd.code_', _hw_mod, ' NOT IN (
      ''out''
      ,''CORR''
      ,''CONF''
      ,''UNK''
      )
    AND vd.value_ind > 0'
  );

---Apļa sektora vērtības atlase.
----Atlasa 7 populārākos grupējumus priekš profesijām/teritorijām.
_sql_top := '(
    SELECT brdwn
      ,brdwn_code
      ,COUNT(brdwn_code) cnt
    FROM sql_sector
    GROUP BY brdwn
      ,brdwn_code
    ORDER BY cnt DESC LIMIT 7
    )';

---Apļa sektoram visi kodi.
_sql_sector := CONCAT ('SELECT DISTINCT ON (vd.code_', _hw_mod, ') vd.year
    ,vd.code_w
    ,vd.code_h
    ,vd.level_w
    ,vd.level_h
    ,vd.brdwn
    ,vd.brdwn_code
    ,vd.code_', _hw_mod, ' code
    ,vd.value_ind
  FROM tea.data vd
  WHERE vd.year = ', _year
  );

_sql_sector := CONCAT (
  _sql_sector
  ,'
    AND vd.level_w = ' || _level_w
  ,'
    AND vd.level_h = ' || _level_h
  ,'
    AND vd.code_w = ''' || _code_w || ''''
  ,'
    AND vd.code_h = ''' || _code_h || ''''
  );

_sql_sector := CONCAT (
  _sql_sector
  ,'
    AND value_code = ''', _value_code, '''
    AND brdwn = ''', _brdwn, '''
    AND vd.code_', _hw_mod, ' NOT IN (
      ''out''
      ,''CORR''
      ,''CONF''
      ,''UNK''
      )
    AND vd.value_ind > 0'
  );

IF _brdwn_code = 'total'
  THEN _sql_sector := CONCAT (
    _sql_sector
    ,'
    AND vd.brdwn_code != ''total'''
    );
ELSE _sql_sector := CONCAT (
  _sql_sector
  ,'
    AND brdwn_code = ''', _brdwn_code, ''''
  );
END IF;

_sql_sector := CONCAT (
  _sql_sector
  ,'
  ORDER BY code_', _hw_mod, '
    ,value_ind DESC'
  );

---Dalītāja atlase.
_sql_divider := CONCAT ('SELECT st.code code
    ,');

----Reizina ar 100, ja vērtība uz 100 iedzīvotājiem.
IF _m2 = 'e'
  THEN _sql_divider := CONCAT (
    _sql_divider
    ,'ROUND(st.value_ind / NULLIF(dv.value_ind, 0) * 100, 1) choro'
    );
ELSE _sql_divider := CONCAT (
  _sql_divider
  ,'ROUND(st.value_ind / NULLIF(dv.value_ind, 0), 0) choro'
  );
END IF;

----Debug.
/*
_sql_divider := CONCAT (
  _sql_divider
  ,',2) choro '
  );
*/

---Dalītāju pielase. Ja aplim ir sektors, tad izmanto sektoru tabulu.
CASE
  WHEN _t2 = 'LV'
    AND _brdwn = 'total'
    AND _m2 = 'e'
  THEN _sql_divider := CONCAT (
    _sql_divider
    ,'
  FROM tea.data dv
  JOIN sql_total st ON dv.year = st.year
    AND dv.level_w = 99
    AND dv.level_h = st.level
    AND dv.code_w = ''total''
    AND dv.code_h = st.code
    AND '
    );

    _sql_divider := CONCAT (
      _sql_divider
      ,'dv.brdwn = ''pop''
  AND dv.brdwn_code = ''y15y64''
  AND dv.value_code = ''persons'''
      );

  WHEN _brdwn = 'total'
    AND _m2 != 'e'
  THEN _sql_divider := CONCAT (
    _sql_divider
    , '
  FROM tea.data dv
  JOIN sql_total st ON dv.year = st.year
    AND dv.level_w = st.level_w
    AND dv.level_h = st.level_h
    AND dv.code_w = st.code_w
    AND dv.code_h = st.code_h
    AND '
    );

    CASE
      WHEN _m1 = 'h'
        THEN _sql_divider :=- CONCAT (
          _sql_divider
          ,'dv.brdwn = ''total''
  AND dv.brdwn_code=''total''
  AND dv.value_code= ''empl''');

      WHEN _m1 = 'w'
        THEN _sql_divider := CONCAT (
          _sql_divider
          ,'dv.brdwn = ''total''
  AND dv.brdwn_code = ''total''
  AND dv.value_code = ''empl_w'''
          );
    ELSE
    END CASE;

  ----Svārsmigrācijas dalījums.
  WHEN _t2 != 'LV'
    AND (
      _brdwn = 'total'
      OR (
        _brdwn != 'total'
        AND _brdwn_code = 'total'
        )
      )
    AND _m2 = 'e'--Modificēts priekš fona topam.
    THEN _sql_divider := CONCAT (
      _sql_divider
      ,'
  FROM tea.data dv
  JOIN sql_total st ON dv.year = st.year
    AND '
      );

      IF _m1 = 'h'
        THEN _sql_divider := CONCAT (
          _sql_divider
          ,'dv.level_w = 99
    AND dv.level_h = st.level_h
    AND dv.code_w = ''total''
    AND dv.code_h = st.code_h
    AND '
          );

      _sql_divider := CONCAT (
        _sql_divider
        ,'dv.value_code = ''empl''
    AND '
        );

      ELSE _sql_divider := CONCAT (
        _sql_divider
        ,'dv.level_w = 99
    AND dv.level_h = st.level_h
    AND dv.code_w = ''total''
    AND dv.code_h = st.code_h
    AND '
        );

      _sql_divider := CONCAT (
        _sql_divider
        ,'dv.value_code = ''empl_w''
    AND '
        );
      END IF;

      _sql_divider := CONCAT (
        _sql_divider
        ,'dv.brdwn = ''', _brdwn, '''
    AND dv.brdwn_code = ''total'''
        );

  WHEN _brdwn != 'total'
    AND _m2 = 'e'
    THEN _sql_divider := CONCAT (
      _sql_divider
      ,'
  FROM sql_sector st
  JOIN sql_total dv ON dv.code = st.code'
      );

  WHEN _brdwn != 'total'
    AND _m2 != 'e'
    THEN _sql_divider := CONCAT (
      'SELECT dv.code code
    ,ROUND(dv.value_ind / NULLIF(st.value_ind, 0), 0) choro'
      );

      _sql_divider := CONCAT (
        _sql_divider
        ,'
  FROM sql_sector dv
  JOIN tea.data st ON dv.year = st.year
    AND dv.level_w = st.level_w
    AND dv.level_h = st.level_h
    AND dv.code_w = st.code_w
    AND dv.code_h = st.code_h
    AND dv.brdwn = st.brdwn
    AND dv.brdwn_code = st.brdwn_code
    AND '
        );

      CASE
        WHEN _m1 = 'h'
          THEN _sql_divider := CONCAT (
            _sql_divider
            ,'st.value_code = ''empl'''
            );

        WHEN _m1 = 'w'
          THEN _sql_divider := CONCAT (
            _sql_divider
            ,'st.value_code = ''empl_w'''
            );
        ELSE
        END CASE;
  ELSE
  END CASE;

---Apvieno iepriekšējo un konstruē JSON daļu.
_sql_final := 'sql_final
AS (
  SELECT CASE 
      WHEN st.code = ''total''
        THEN code_sel
      ELSE st.code
      END code_ter
    ,CASE 
      WHEN st.code = ''total''
        THEN ''parent''
      ELSE ''flow''
      END flow_type
    ,st.value_ind value_total
    ,';

IF _brdwn != 'total'
  THEN _sql_final := CONCAT (
    _sql_final
    ,'ss.brdwn_code
    ,ss.value_ind value
    ,COALESCE (top.brdwn_code, ''other'') display_brdwn_code
    ,');
END IF;

_sql_final := CONCAT (
  _sql_final
  ,'sd.choro
  FROM sql_total st'
  );

IF _brdwn != 'total'
  THEN _sql_final := CONCAT (
    _sql_final
    ,'
  JOIN sql_sector ss ON st.code = ss.code
  LEFT JOIN sql_top top ON ss.brdwn_code = top.brdwn_code'
    );
END IF;

_sql_final := CONCAT (
  _sql_final
  ,'
  LEFT JOIN sql_divider sd ON st.code = sd.code
  WHERE st.code NOT IN (
    ''out''
    ,''CORR''
    ,''CONF''
    ,''UNK''
    )
  )'
  );

---Apļa sektori.
IF _brdwn != 'total'
  THEN _sql_final := CONCAT (
    _sql_final
    ,'
  ,count_sectors
AS (
  SELECT brdwn_code
    ,display_brdwn_code
    ,COUNT(brdwn_code) count_cases
    ,ROW_NUMBER() OVER (
      ORDER BY COUNT(brdwn_code) DESC
      ) row_order
  FROM sql_final
  GROUP BY brdwn_code
    ,display_brdwn_code
  ORDER BY COUNT(brdwn_code) DESC
    ,brdwn_code ASC
  )
  ,count_sectors_distinct
AS (
  SELECT a.display_brdwn_code
    ,SUM(count_cases) cases
    ,ROW_NUMBER() OVER (
      ORDER BY SUM(count_cases) DESC
      ) row_numb
  FROM count_sectors a
  GROUP BY a.display_brdwn_code
  )
  ,dummy
AS (
  SELECT a.*
    ,mcp.color_id
  FROM count_sectors_distinct a
  JOIN tea.meta_color_priority mcp ON mcp.brdwn_code = a.display_brdwn_code
    AND mcp.brdwn = ''', _brdwn, '''
  )
  ,dummy1
AS (
  SELECT display_brdwn_code
    ,cases
    ,row_numb
    ,CASE 
      WHEN (
          SELECT COUNT(color_id)
          FROM dummy aa
          WHERE aa.row_numb < a.row_numb
            AND aa.color_id = a.color_id
          ) = 0
        THEN color_id
      ELSE 0
      END color_id
  FROM dummy a
  ORDER BY row_numb
  )
  ,dummy2
AS (
  SELECT DISTINCT ROW_NUMBER() OVER (
      ORDER BY color_id
      ) row_numb
    ,color_id
  FROM (
    SELECT DISTINCT color_id
    FROM tea.meta_color_priority
    WHERE brdwn = ''', _brdwn, '''
      AND color_id NOT IN (
        SELECT color_id
        FROM dummy
        )
    ) a
  )
  ,color_res
AS (
  SELECT a.display_brdwn_code
    ,CASE 
      WHEN a.color_id = 0
        THEN d2.color_id
      ELSE a.color_id
      END
  FROM (
    SELECT display_brdwn_code
      ,row_numb
      ,color_id
      ,ROW_NUMBER() OVER (
        PARTITION BY color_id ORDER BY color_id
        ) row_numb1
    FROM dummy1
    ) a
  LEFT JOIN dummy2 d2 ON d2.row_numb = a.row_numb1
  )'
    );
END IF;

_sql_final := CONCAT (
  _sql_final
  ,'
SELECT json_build_object(
  ''map_set'', json_object_agg(
    r_name
    ,r_t
    )
  ) r_t
FROM (
  (
    SELECT ''map_data'' r_name
      ,json_agg(json_build_object(
        ''code'', code_ter
        ,'
  );

IF _brdwn != 'total'
  THEN _sql_final := CONCAT (
    _sql_final
    ,'''property_id'', brdwn_code
        ,''display_property_id'', display_brdwn_code
        ,''value'', value
        ,'
    );
END IF;

IF _t2 != 'LV'
  THEN _sql_final := CONCAT (
    _sql_final
    ,'''type'', flow_type
        ,'
    );
END IF;

_sql_final := CONCAT (
  _sql_final
  ,'''value_total'', value_total
        ,''choro'', choro
        )) r_t
    FROM sql_final
    )
  ');

IF _brdwn != 'total'
  THEN _sql_final := CONCAT (
    _sql_final
    ,'
  UNION ALL
  
  (
    SELECT ''sector_meta'' r_name
      ,json_agg(r_t) r_t
    FROM (
      SELECT json_build_object(
        ''property_id'', cs.brdwn_code
        ,''display_property_id'', cs.display_brdwn_code
        ,''count'', cs.count_cases
        ,''order'', cs.row_order
        ,''color_code'', cr.color_id
        ) r_t
      FROM count_sectors cs
      LEFT JOIN color_res cr ON cs.display_brdwn_code = cr.display_brdwn_code
      ) inn
    )
  '
    );
END IF;

_sql_final := CONCAT (
  _sql_final
  ,'
  UNION ALL
  
  (
    SELECT ''clusters'' r_name
      ,getbreaks_classes(array_agg(choro), 5, ''none'', ''fisher'', ', $9, ')->''upper'' r_t
    FROM sql_divider
    WHERE choro > 0
      AND code != ''total''
    )
  ) jso'
  );

_sql_main := CONCAT (
  'WITH sql_total
AS (
  ', _sql_total, '
  )
  ,'
  );

IF _brdwn != 'total'
  THEN _sql_main := CONCAT (
    _sql_main
    ,'sql_sector
AS (
  ', _sql_sector, '
  )
  ,sql_top
AS (
  ', _sql_top, '
  )
  ,'
  );
END IF;

_sql_main := CONCAT (
  _sql_main
  ,'sql_divider
AS (
  ', _sql_divider, '
  )
  ,' ,_sql_final, ';'
  );

/**
RAISE NOTICE 'sql_main: %', _sql_main;
RAISE NOTICE 'sql_top: %', _sql_top;
RAISE NOTICE 'sql_total: %', _sql_total;
RAISE NOTICE 'sql_sector: %', _sql_sector;
RAISE NOTICE 'sql_divider: %', _sql_divider;
**/

EXECUTE _sql_main
INTO _data_execute;
/*USING _year
  ,_level_w
  ,_level_h
  ,_code_w
  ,_code_h
  ,_value_code
  ,_brdwn
  ,_brdwn_code;*/

RETURN query
SELECT _data_execute.r_t r_t
  ,json_build_object('SQL_code', _sql_main) debug;

EXCEPTION
  WHEN OTHERS
    THEN GET STACKED DIAGNOSTICS _error_msg = MESSAGE_TEXT
      ,_error_detail = PG_EXCEPTION_CONTEXT
      ,_error_hint = PG_EXCEPTION_DETAIL;

RETURN query
SELECT json_build_object('error_msg', _error_msg, 'error_detail', _error_detail, 'error_hint', _error_hint) r_t
  ,json_build_object('SQL_code', _sql_main) debug;

END;
$BODY$;

REVOKE ALL
  ON FUNCTION tea.a_generate_map_viz(TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT, NUMERIC)
  FROM public;
