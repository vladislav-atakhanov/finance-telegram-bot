SELECT
    Product.title as title,
    Meta.title as meta,
    Expense.price as price
FROM Expense
JOIN
    Meta ON meta_id=Meta.id,
    Product ON product_id=Product.id
WHERE
    Product.user_id=? AND
    julianday(date(date_, 'unixepoch'))=julianday(date(?, 'unixepoch'))
