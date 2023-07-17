# About
The most important decision was certainly the choice of a framework. Since I had already gained experience with express, I chose this one.

## Challenges
The biggest challenge was to work with MongoDB, as I had no real experience with this database. The choice for an ODM framework fell on mongoose, as it enjoys a high popularity. The implementation was pleasantly simple. Only the error handling is not very intuitive when the validation of values fails or in case of duplicates.

## Decisions
In the introduction, a scalable solution was required. To ensure this, I chose pagination in the case of the endpoint for loading all wines, so that no performance problems occur.

### Testing
Since I already had experience with Postman tests, I decided to use them. Compared to unit tests, this test variant offers the advantage that the entire API is tested and not just individual functions. Likewise, the speed of the API can also be tested automatically, for example.


## Improvements
- Logging
- Tests for all endpoints
- Unit tests to further increase test coverage
- Alpine containers instead of node containers to reduce size
- Pagination for the search endpoint
- More abstract error handling 