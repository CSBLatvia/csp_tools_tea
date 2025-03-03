CREATE OR REPLACE FUNCTION tea.get_territory(
  reference_period integer,
  territ_level integer,
  territory_code text)
    RETURNS TABLE(name_lv text, name_lv_acc text, name_lv_dat text, name_lv_gen text, name_lv_loc text, name_lv_short text, name_lv_short_acc text, name_lv_short_dat text, name_lv_short_gen text, name_lv_short_loc text, name_en text, name_en_short text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

DECLARE territ_name RECORD;

BEGIN

RETURN query
WITH c
AS (
  SELECT MAX(date) date
  FROM web.territories_lv_3857
  WHERE level = 3
  )
  ,c2
AS (
  SELECT MAX(date) date
  FROM web.territories_lv_3857
  WHERE level = 4
  )
  ,d
AS (
  SELECT MAX(date) date
  FROM web.territories_lv_3857
  WHERE level = 7
    AND date <= (reference_period || '-01-01')::DATE
  )
  ,ts
AS (
  SELECT a.level
    ,a.code
    ,a.name_lv
    ,a.name_lv_acc
    ,a.name_lv_dat
    ,a.name_lv_gen
    ,a.name_lv_loc
    ,a.name_lv_short
    ,a.name_lv_short_acc
    ,a.name_lv_short_dat
    ,a.name_lv_short_gen
    ,a.name_lv_short_loc
    ,a.name_en
    ,a.name_en_short
  FROM web.territories_lv_3857 a
  INNER JOIN c ON a.date = c.date
  WHERE level = 3
  
  UNION
  
  SELECT a.level
    ,a.code
    ,a.name_lv
    ,a.name_lv_acc
    ,a.name_lv_dat
    ,a.name_lv_gen
    ,a.name_lv_loc
    ,a.name_lv_short
    ,a.name_lv_short_acc
    ,a.name_lv_short_dat
    ,a.name_lv_short_gen
    ,a.name_lv_short_loc
    ,a.name_en
    ,a.name_en_short
  FROM web.territories_lv_3857 a
  INNER JOIN c2 ON a.date = c2.date
  WHERE level = 4
  
  UNION
  
  SELECT a.level
    ,a.code
    ,a.name_lv
    ,a.name_lv_acc
    ,a.name_lv_dat
    ,a.name_lv_gen
    ,a.name_lv_loc
    ,a.name_lv_short
    ,a.name_lv_short_acc
    ,a.name_lv_short_dat
    ,a.name_lv_short_gen
    ,a.name_lv_short_loc
    ,a.name_en
    ,a.name_en_short
  FROM web.territories_lv_3857 a
  INNER JOIN d ON a.date = d.date
  WHERE level = 7
  )
SELECT ts.name_lv::TEXT
  ,ts.name_lv_acc::TEXT
  ,ts.name_lv_dat::TEXT
  ,ts.name_lv_gen::TEXT
  ,ts.name_lv_loc::TEXT
  ,ts.name_lv_short::TEXT
  ,ts.name_lv_short_acc::TEXT
  ,ts.name_lv_short_dat::TEXT
  ,ts.name_lv_short_gen::TEXT
  ,ts.name_lv_short_loc::TEXT
  ,ts.name_en::TEXT
  ,ts.name_en_short::TEXT
FROM ts
WHERE ts.level = territ_level::INT
  AND ts.code = territory_code;

END;
$BODY$;

REVOKE ALL
  ON FUNCTION tea.get_territory(INTEGER, INTEGER, TEXT)
  FROM public;