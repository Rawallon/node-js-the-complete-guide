# Wrap Up

## Pagination

Pagination was achieved using the _.countDocuments_ method in mongoose that takes advantage of the way _.find_ works, using its cursor to count rather then retrieve the data, making it faster, to also optimize data fetching the methods _.skip_ and _.limit_ were used.

A similar result can be achieved with SQL using the _COUNT_ and _LIMIT_.
