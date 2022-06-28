import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Login/register'
import Movies from './pages/Movies'
import NewMovie from './pages/Movies/newMovie'
import Rentals from './pages/Rentals'
import NewRental from './pages/Rentals/newRental'
import Genres from './pages/Genres'
import NewGenre from './pages/Genres/newGenre'

export default function Routes(){
    return(
        <Router>
            <Switch>
                <Route path="/" exact component={Login}/>
                <Route path="/register" exact component={Register}/>
                <Route path="/movies" exact component={Movies}/>
                <Route path="/movie/new/:movieId" exact component={NewMovie}/>
                <Route path="/rentals" exact component={Rentals}/>
                <Route path="/rental/new/:rentalId" exact component={NewRental}/>
                <Route path="/genres" exact component={Genres}/>
                <Route path="/genre/new/:genreId" exact component={NewGenre}/>

            </Switch>
        </Router>
    )
}