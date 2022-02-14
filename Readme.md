# Coding Exercise

The goal of these exercises are to show proficiency in software engineering. All instructions and guidelines are listed below.

## Setup

1. Clone this repository with `git clone https://github.com/amorkor/backend-coding-test.git`
2. Ensure `node (>8.6 and <= 10)` and `npm` are installed and set as current
4. Run `npm install`
5. Run `npm test`
6. Run `npm start`
7. Hit the server to test health `curl localhost:8010/health` and expect a `200` response 

## Tasks

Below will be the set of tasks to accomplish.

1. [Documentation](#documentation)
2. [Implement Tooling](#implement-tooling)
3. [Implement Pagination](#implement-pagination)
4. [Refactoring](#refactoring)
5. [Security](#security)
6. [Load Testing](#load-testing)

### Documentation

To view documentation of API just:

1. Run server with `npm start`
2. Go to [localhost:8010/docs](localhost:8010/docs)

### Tooling

Project has following additional tooling:

1. `eslint` - for linting
2. `nyc` - for code coverage
3. `pre-push` - for git pre push hook running tests
4. `winston` - for logging
5. `typescript` - for type checking

### Pagination

GET /rides endpoint support error-resilient pagination.

### Refactoring

The app is refactored and follows modern best practices.

Key changes:

- Migrate from callbacks to Promises and async/await. Provide convenient error monitoring with try/catch.
- Move logic in API to separate tiers: models and services. Leave thin controller. Split express app to routers.
- Introduce unit testing and deeper integration testing.

### Security

System is provided with security integrations and tests to make it safe against common web vulnerabilities, including SQL injection.

### Load Testing

Also, the app is tested with artillery to ensure ability to handle high loads.
