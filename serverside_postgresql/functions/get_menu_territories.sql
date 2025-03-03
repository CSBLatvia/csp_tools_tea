CREATE OR REPLACE FUNCTION tea.get_menu_territories(
  _t1 integer,
  _year integer,
  _code text DEFAULT NULL::text)
    RETURNS SETOF json 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

BEGIN

RETURN QUERY

SELECT json_build_object('data', json_agg(aa.*))
FROM (
  SELECT a.code
    ,a.level
    ,a.name_lv
    ,a.name_en
    ,a.name_lv_short
    ,a.name_en_short
    ,a.name_lv_gen
    ,a.name_lv_dat
    ,a.name_lv_loc
    ,a.name_lv_short_gen
    ,a.name_lv_short_dat
    ,a.name_lv_short_loc
  FROM web.territories_lv_3857 a
  WHERE (
      a.date = (
        SELECT MAX(b.date)
        FROM web.territories_lv_3857 b
        WHERE CASE 
            WHEN $1 = 7
              THEN level = 7
                AND b.date <= to_date(($2)::TEXT, 'YYYY')
            WHEN $1 = 4
              THEN b.level = 4
            ELSE b.level = 3
            END
        )
      )
    AND CASE 
      WHEN $3 IS NOT NULL
        THEN a.code = $3
      ELSE true
      END
    AND a.level = $1
  ORDER BY a.code
  ) aa;

END;
$BODY$;

REVOKE ALL
  ON FUNCTION tea.get_menu_territories(INTEGER, INTEGER, TEXT)
  FROM public;