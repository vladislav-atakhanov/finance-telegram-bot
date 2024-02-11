import sqlite3
from pathlib import Path

__dirname__ = Path(__file__).parent


with open(__dirname__.parent / "src" / "init.sql", "r", encoding="utf-8") as f:
    init_sql = f.read()

database = sqlite3.connect(__dirname__.parent / "finance.db")
cursor = database.cursor()

cursor.executescript(init_sql)
database.commit()

cursor.execute("ALTER TABLE Product DROP COLUMN criterion")
database.commit()

cursor.execute("SELECT id, title FROM Product")
for id, title in cursor.fetchall():
    print(id, title)
    cursor.execute(
        "INSERT INTO Alias (alias, product_id) VALUES (?, ?)", (title.lower(), id)
    )
database.commit()

database.close()
