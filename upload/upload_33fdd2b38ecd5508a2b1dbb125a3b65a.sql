PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE mytable(
id integer primary key not null,
name nvarchar(50),
age integer);
INSERT INTO "mytable" VALUES(1,'sfdsf',23);
INSERT INTO "mytable" VALUES(2,'abby',34);
COMMIT;
