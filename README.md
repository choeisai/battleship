[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Requirement

- mongodb server
- node 8.5.0

## Installation

```
git clone https://github.com/karrung/battleship.git
cd battleship
yarn install
```

## Configurations
> Copy from `.env.example` template and `.env` as you wish
```shell
cp .env.example .env
```

## API start

```
yarn start
```

## API Doc

### Start new game

- request
```
method: post
url: http://localhost:3000/api/v1/games
```

- response
```
{
  "gameId": "59c46201843a7fc25f5fe6f7",
  "message": "game created"
}
```

### Defender turn (place ship)

- request
```
method: post
url: http://localhost:3000/api/v1/games/:id/defender
body:
{
  "position": [
    { "row": "5", "col": "A" },
    { "row": "5", "col": "B" },
    { "row": "5", "col": "C" },
    { "row": "5", "col": "D" }
  ]
}
```

- response
```
{
  "gameId": "59c46201843a7fc25f5fe6f7",
  "message": "defender move created",
  "ship": "BATTLESHIP",
  "position": [
    {
      "row": "5",
      "col": "A"
    },
    {
      "row": "5",
      "col": "B"
    },
    {
      "row": "5",
      "col": "C"
    },
    {
      "row": "5",
      "col": "D"
    }
  ]
}
```

### Attacker turn (fire ocean)

- request
```
method: post
url: http://localhost:3000/api/v1/games/:id/attacker
body:
{
  "position": { "row": "10", "col": "C" }
}
```

- response
```
{
  "_id": "59c4befba3f2a7deae16ce0d",
  "result": "Win ! You completed the game in 21 moves, HIT 20 moves and MISS 1 moves.",
  "updatedAt": "2017-09-22T07:42:51.535Z",
  "createdAt": "2017-09-22T07:42:51.535Z",
  "gameId": "59c46201843a7fc25f5fe6f7",
  "fire": {
    "row": "10",
    "col": "C"
  },
  "isCompleted": false
}
```
