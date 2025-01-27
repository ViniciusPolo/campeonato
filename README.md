# Simula Campeonato

### * This project simulates a championship, where teams are included by name, and the championship is also created, when there are at least 8 teams created, the games and their results can be simulated, using the steps below, going through the quarter finals, semi and third place and final.
### When returning game information through get, tournaments and teams are referenced by their respective id's 
### * Sample tests were implemented, to validate models.
#### Let's start

* Check if already docker and docker-compose installed

#### On first time use:
```
sudo docker-compose up --build
```
#### After is recommanded to use:
```
sudo docker-compose down
```
```
sudo docker-compose build
```
```
sudo docker-compose up
```
* ### POSTS
### Add new Team
```
POST http://localhost:3000/teams/add-new
```
> body
>```
>{"name" : "Francana"}
>```
### Add new Tournament
```
POST http://localhost:3000/tournament/add-new
```
> body
>```
>{"name" : "Copa-Brasil"}
>```
## Simulate games and results
```
POST http://localhost:3000/games/add-new?tournament=Copa-Brasil&round_of=quarter
```
> query params
>```
> * tournament=Copa-Brasil
> * round_of=quarter
>```

>```
>  types of quarter:
> - quarter
> - semi
> - third
> - final
>```
* The semi only be simulated if round of quarter alright exists, final and third place only if semi exists, if try to simulate rounds already simulated it return a error 409

## After execute all API's and simulate all stages, in the Final will show a response like this
```
{
    "status": 1,
    "message": "Francana is the Champion"
}
```

* ## GETS
```
GET http://localhost:3000/teams
```
```
GET http://localhost:3000/tournament
```
```
GET http://localhost:3000/games
```

* this project don't have environment variables, have some repetions of code, because short time. So this one could be refactor.