# Tic Tac Toe Domain Model

A Tic Tac Toe domain model

## Endpoints

### POST /api/players

Creates a new `Player`.
It returns the new Player's id.

Payload:

```json
{
  "email": "player.one@example.com"
}
```

Example:

```bash
$ curl -H "Content-Type: application/json" -d '{"email": "player.one@example.com"}' http://localhost:3000/api/players

{"id":"d7ee29b3-cfdf-4643-b2e9-51c152c609a5"}
```

### POST /api/games

Creates a new `Game`.
It returns the new Game's id.

Example:

```bash
$ curl -X POST http://localhost:3000/api/games

{"id":"58e997d3-3ce4-4576-8165-8c2829577977"}
```

### POST /api/games/:gameId

Join a `Player` to a `Game`.

Payload:

```json
{
  "playerId": "a0b1c2d3-e4f5-6g7h-8i9j-klmnopqrstuv"
}
```

Example:

```bash
$ curl -H "Content-Type: application/json" -d '{"playerId": "d7ee29b3-cfdf-4643-b2e9-51c152c609a5"}' http://localhost:3000/api/games/58e997d3-3ce4-4576-8165-8c2829577977
```

curl -d '{"playerId": "d7ee29b3-cfdf-4643-b2e9-51c152c609a5", "row": 1, "column": 2, "mark": "X"}' -H "Content-Type: application/json" http://localhost:3000/api/games/58e997d3-3ce4-4576-8165-8c2829577977/moves
