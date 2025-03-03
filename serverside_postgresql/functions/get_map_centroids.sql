CREATE OR REPLACE FUNCTION tea.get_map_centroids(
  _t1 integer,
  _year integer)
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
    ,a.lat
    ,a.lon
  FROM web.territories_lv_3857_cntr a
  WHERE (
      a.date = (
        SELECT MAX(b.date)
        FROM web.territories_lv_3857 b
        WHERE CASE 
            WHEN $1 = 7
              THEN level = 7
                AND b.date <= to_date(($2 + 1)::TEXT, 'YYYY')
            WHEN $1 = 4
              THEN b.level = 4
            ELSE b.level = 3
            END
        )
      )
    AND a.level = $1
  ORDER BY a.code
  ) aa;

END;
$BODY$;

REVOKE ALL
  ON FUNCTION tea.get_map_centroids(INTEGER, INTEGER)
  FROM public;