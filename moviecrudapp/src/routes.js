import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Layout from './components/Layout'
import Login from './components/Login'
import Register from './components/Login/register'
import Movies from './components/Movies'
import NewMovie from './components/Movies/newMovie'
import Rentals from './components/Rentals'
import NewRental from './components/Rentals/newRental'
import Genres from './components/Genres'
import NewGenre from './components/Genres/newGenre'

export default function Routes(){
    return(
        <Router>
            <Switch>
                <Route path="/index" exact component={Layout}/>
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