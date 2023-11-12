# Make sure you have docker installed

$ docker -v

# Run dev server

$ docker-composes up

# How to create migration

1. $ diesel migration generate name_of_your_migration
2. Write your migration in up.sql and down.sql files
3. $ diesel migration run
4. After that your schema.rs file should be changed, make sure that types are
   correct
5. $ docker-compose up --build

> Order of type fileds should be exact like in the scheme. See example with
> `words` scheme and `pub struct DbWord`
