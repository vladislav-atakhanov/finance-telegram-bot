SELECT
    Category.title as category,
    sum(price) as value
FROM Expense
JOIN
    Product ON Product.id = product_id,
    Category ON Category.id = category_id,
    Meta ON Meta.id = meta_id
WHERE
    Category.user_id=? AND
    julianday (CURRENT_TIMESTAMP) - julianday (date (date_, 'unixepoch')) <= 30
GROUP BY
    Category.id
ORDER BY
    sum(price) DESC