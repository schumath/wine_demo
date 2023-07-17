# About
The most important decision was certainly the choice of a framework. Since I had already gained experience with express, I chose this one.

If you have detailed questions about my design process, don't hesitate to ask me personally.

## Challenges
The biggest challenge was to work with MongoDB, as I had no real experience with this database. The choice for an ODM framework fell on mongoose, as it enjoys a high popularity. The implementation was pleasantly simple. Only the error handling is not very intuitive when the validation of values in the request body fails or in case of duplicates.

## Decisions
In the introduction, a scalable solution was required. To ensure this, I chose pagination in the case of the endpoint for loading all wines, so that no performance problems occur.

### Testing
Since I already had experience with Postman tests, I decided to use them. Compared to unit tests, this test variant offers the advantage that the entire API is tested and not just individual functions. Likewise, the speed of the API can also be tested automatically, for example.

### Documentation
Since I had good experience with OpenAPI documentation for RestAPIs I chose this one. I tried to do inline documentation with swagger-ui-express and swagger-jsdoc. The advantage is that the documentation is in the same place as the code. In retrospect, however, not the best decision, as the code becomes very cluttered and OpenAPI support and autocorrect of my IDE (IntelliJ PHPStorm) does not work. 

## Improvements
- Logging
- Tests for all endpoints
- Unit tests to further increase test coverage
- Alpine containers instead of node containers to reduce size
- Pagination for the search endpoint
- More abstract error handling
- Improved response in case of an invalid JSON-body
