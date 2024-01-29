SELECT
    sum(price) as value
FROM Expense
JOIN
    Meta ON meta_id=Meta.id
WHERE
    user_id=? AND
    julianday(date(date_, 'unixepoch'))=julianday(date(?, 'unixepoch'))