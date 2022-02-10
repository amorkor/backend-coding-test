# Xendit Coding Exercise

The goal of these exercises are to show proficiency in software engineering that is related to the daily work at Xendit. All instructions and guidelines are listed below.

## Setup

1. Clone this repository with `git clone https://github.com/amorkor/backend-coding-test.git`
2. Ensure `node (>8.6 and <= 10)` and `npm` are installed
3. While in project root, run `nvm use`
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

Please implement the following refactors of the code:

1. Convert callback style code to use `async/await`
2. Reduce complexity at top level control flow logic and move logic down and test independently
3. **[BONUS]** Split between functional and imperative function and test independently

#### Success Criteria

1. A pull request against `master` of your fork for each of the refactors above with:
    1. Code changes
    2. Tests

### Security

Please implement the following security controls for your system:

1. Ensure the system is not vulnerable to [SQL injection](https://www.owasp.org/index.php/SQL_Injection)
2. **[BONUS]** Implement an additional security improvement of your choice

#### Success Criteria

1. A pull request against `master` of your fork with:
    1. Changes to the code
    2. Tests ensuring the vulnerability is addressed

### Load Testing

Please implement load testing to ensure your service can handle a high amount of traffic

#### Success Criteria

1. Implement load testing using `artillery`
    1. Create a PR against `master` of your fork including artillery
    2. Ensure that load testing is able to be run using `npm test:load`. You can consider using a tool like `forever` to spin up a daemon and kill it after the load test has completed.
    3. Test all endpoints under at least `100 rps` for `30s` and ensure that `p99` is under `50ms`
