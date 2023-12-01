# Tic Tac Toe Domain Model

An API to play Tic Tac Toe via HTTP.  
The Game was modeled using the Domain Driven Design approach to practice the concepts learned after attending the "Domain Models in practice: DDD, CQRS & Event Sourcing" workshop.

## Model

The domain model is composed of the following entities:

- `Game`: The game aggregate represents a Tic Tac Toe game. It contains the game's board and a reference to the players which are playing the game. It encapsulates the game's rule and exposes methods to let a player join a game and make a move.

- `Player`: The player aggregate represents a player of the game. It contains the player's unique email address.

- `Move`: The move entity represents a move made by a player in a game. It contains the identifier of the player who made the move along its mark ("X" or "O"), the position on the board where the move was made and the identifier of the game in which the move was made.

## Event Storming

I designed the domain model using the [Event Storming](https://ziobrando.blogspot.com/2013/11/introducing-event-storming.html) technique.  
After some iterations on the model, it looks like this:

![Event Storming Board](https://github.com/gabrieledarrigo/tic-tac-toe/assets/1985555/b1fa958b-be06-45d1-a6ef-debb146ce657)

This is the `Game`'s aggregate lifecycle:

![Game Aggregate life cycle](https://github.com/gabrieledarrigo/tic-tac-toe/assets/1985555/b050a1f3-a372-42b1-b506-86ac52b11eec)

## Running the application

To run the application, install all application dependencies:

```bash
$ npm install
```

Tic Tac Toe API use a dockerized instance of PostgreSQL for its persistence layer.  
So, first run the Docker container for the database:

```bash
$ docker compose up
```

Finally, run one of the following commands to lunch the application:

```bash
# Development
$ npm run start

# Watch mode
$ npm run start:debug

# Production mode
$ npm run start:prod
```

## Test

To run the application's unit tests, run the following command:

```bash
$ npm run test
```

## API Documentation

The API documentation uses the OpenAPI specification and is exposed with the @nestjs/swagger plugin on the following
url: http://localhost:3000/api/docs
