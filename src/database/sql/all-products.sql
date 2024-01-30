SELECT
    Product.id as id,
    Product.title as title,
    Category.title as category
FROM Product
JOIN
    Category on Category.id = category_id
WHERE
    Product.user_id=?
ORDER BY
    Product.title