# The Wine API
The Wine API is a RESTful API that allows you to perform CRUD operations on a wine database. The API is built using Node.js, Express, and MongoDB.

## Prerequisites
Make sure you have installed all the following prerequisites on your development machine:
- git
- Node.js (Recommended: v18.16.1 LTS)
- Docker
- Postman (Optional)

## Documentation
- About the creation of this API: docs/ABOUT.md
- Documentation of the endpoints: docs/openapi.json (can be opened e.g. with https://editor.swagger.io/)

## Getting Started
Clone the repository
```console
git clone https://github.com/schumath/wine_demo.git
```
Navigate to the project folder
```console
cd wine_demo
```
Build and start the database and the API. This will take a few seconds the first time.
```console
docker-compose up
```
The API is now available at http://localhost:3003. To see the API documentation, go to http://localhost:3003/docs


After changes you can rebuild the API with
```console
docker-compose up --build
```


## Development
Install dependencies
```console
npm install
```
Start the database container
```console
docker-compose up mongodb
```
Start the API in development mode. The API will automatically restart if you make any changes to the code.
```console
npm run dev
```
The development API is now available at http://localhost:3002. If you make any changes to the code, the API will automatically restart.


## Testing
Testing is done using Newman. Newman is CLI tool to run Postman collections.
Make sure the API is running in development mode. Then run the tests with
```console
npm run test:local
```
To run the tests against the dockerized API, run
```console
npm run test:docker
```

You can also import the Postman collection and environment from the `tests` folder and run the tests manually from the Postman GUI.

### Static Code Analysis
Run eslint
```console
npm run lint
```

