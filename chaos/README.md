# CHAOS Technical Task

***Complete as many questions as you can.***

## Question 1
You have been given a skeleton function `process_data` in the `data.rs` file.
Complete the parameters and body of the function so that given a JSON request of the form

```json
{
  "data": ["Hello", 1, 5, "World", "!"]
}
```

the handler returns the following JSON:
```json
{
  "string_len": 11,
  "int_sum": 6
}
```

Edit the `DataResponse` and `DataRequest` structs as you need.

## Question 2

### a)
Write (Postgres) SQL `CREATE TABLE` statements to create the following schema.
Make sure to include foreign keys for the relationships that will `CASCADE` upon deletion.
![Database Schema](db_schema.png)

**Answer box:**
```sql
CREATE TYPE question_types AS ENUM ('ShortAnswer', 'MultiSelect', 'MultiChoice');

CREATE TABLE forms (
  id integer PRIMARY KEY,
  title text,
  description text
);

CREATE TABLE questions (
  id integer NOT NULL,
  form_id integer NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  title text,
  question_type question_types,
  PRIMARY KEY (id, form_id)
);

CREATE TABLE question_options (
  id integer NOT NULL,
  question_id integer NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option text,
  PRIMARY KEY (id, question_id)
);
```

### b)
Using the above schema, write a (Postgres) SQL `SELECT` query to return all questions in the following format, given the form id `26583`:
```
   id    |   form_id   |           title             |   question_type   |     options
------------------------------------------------------------------------------------------------------------
 2       | 26583       | What is your full name?     | ShortAnswer       | [null]
 3       | 26583       | What languages do you know? | MultiSelect       | {"Rust", "JavaScript", "Python"}
 7       | 26583       | What year are you in?       | MultiChoice       | {"1", "2", "3", "4", "5+"}
```

**Answer box:**
```sql
SELECT q.id, q.form_id, q.title, q.question_type, ARRAY_AGG(qo.option) AS options
FROM questions q
  LEFT JOIN question_options qo ON qo.question_id = q.id
WHERE q.form_id = 26583
GROUP BY q.id, q.form_id, q.title, q.question_type
ORDER BY q.id;
```
