# Wrap Up

So far it was used the memory to stored the data in a variable and then shared across requests or it was stored it in a file, however, this is not how real applications works, instead, the data is typically stored in a database

# What is a SQL database

A SQL database (DB for short), "thinks" in tables, and in every table there are fields, those are called "columns", and every data filed is called a "row".

So lets imagine a table for users of a site, a table with four columns: an identifier, email, name and password, here's how it would be visualized:

| ID  | email              | name     | password        |
| --- | ------------------ | -------- | --------------- |
| 1   | rawallon@gmail.com | Rawallon | strongpw123     |
| 2   | johnDoe@gmail.com  | John     | verystrongpw123 |
| 3   | ...                | ...      | ...             |

Now lets imagine a table for products, with three columns: An identifier, item name and price, here's how it would be visualized:

| ID  | name  | price  |
| --- | ----- | ------ |
| 1   | chair | 120.99 |
| 2   | table | 120.99 |
| 3   | ...   | ...    |

## Relations

A very important feature to SQL DBs is relations, that means that we can use the identifiers field to relate another record, to elaborate on the previous example here's how it would look like

| ID  | user_id | product_id |
| --- | ------- | ---------- |
| 1   | 1       | 2          |
| 1   | 2       | 1          |
| 1   | 1       | 1          |
| 1   | 1       | 5          |

However natural it may feel, this is called normalization, and it's one of the main features of SQL DBs since it eliminates duplication and redundancies

```
SELECT * FROM users WHERE age > 28;
```

A query is made out of especial keywords, the above example displays all records from the table users with the age above 28

In this case

```
SELECT _ FROM _ WHERE _;
```

Are the keywords that make the SQL syntax and

```
_ * _ users _ age > 28;
```

Are the identifiers parameters that we have passed
