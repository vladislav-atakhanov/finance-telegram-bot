SELECT
    date_ as date,
    sum(price) as value
FROM Meta
JOIN
    Expense ON meta_id=Meta.id
WHERE
    user_id=? AND
    julianday(CURRENT_TIMESTAMP) - julianday(date(date_, 'unixepoch')) <= 30
GROUP BY
    date(date_, 'unixepoch')
ORDER BY
    date_