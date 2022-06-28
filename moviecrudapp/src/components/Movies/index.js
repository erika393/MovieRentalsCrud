import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Switch, Button } from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import api from '../../services/api'
import './style.css'
import Layout from '../Layout'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Movies() {

    const [searchInput, setSearchInput] = useState('')
    const [filter, setFilter] = useState([])
    const [genres, setGenres] = useState([])
    const [movies, setMovies] = useState([])

    //recuperando o token do localStorage
    const token = localStorage.getItem('token')

    const history = useHistory()

    const authorization = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const searchMovies = (searchValue) => {
        setSearchInput(searchValue)
        if (searchInput !== '') {
            const dataReturn = movies.filter((item) => {
                return Object.values(item).join('').toLowerCase()
                    .includes(searchInput.toLowerCase())
            })
            setFilter(dataReturn)
        } else {
            setFilter(movies)
        }
    }

    //lidando com os efeitos colaterais do request e pegando os dados dos movies
    useEffect(() => {
        api.get('api/genres', authorization).then(
            response => {
                setGenres(response.data)
            }, token)
        api.get('api/movies', authorization).then(
            response => {
                setMovies(response.data)
            }, token)
    })

    
    function activeValue(active) {
        if (active) {
            return true
        } else {
            return false
        }
    }

    async function editMovie(id) {
        try {
            history.push(`movie/new/${id}`)
        } catch (error) {
            alert('Unable to edit movie')
        }
    }

    async function deleteMovie(id) {
        try {
            if (window.confirm('Want to delete movie id ' + id + '?')) {
                await api.delete(`api/movies/${id}`, authorization)
                setMovies(movies.filter(movie => movie.id !== id))
            }
        } catch (error) {
            alert('Unable to delete movie ' + error)
        }
    }

    return (
        <section className='layout-container'>
            <header>
                <Layout />
            </header>
            <div className='movie-container'>
                <header>
                    <Link className="button" to="movie/new/0">Create Movie</Link>
                </header>
                <div className='search-div'>
                    <input type='text' placeholder="Search a movie..." onChange={(e) => searchMovies(e.target.value)} /><Search className='text-white' />
                </div>
                <h1>Movies</h1>
                {searchInput.length > 0 ? (
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Creation Date</th>
                            <th>Active</th>
                            <th>Genre</th>
                            <th>Edit</th>
                        </tr>
                        {filter.map(movie => (
                            <tr key={movie.id}>
                                <td>{movie.name}</td>
                                <td>{(new Date(movie.creationDate)).toLocaleDateString()}</td>
                                <td>
                                    <Switch checked={activeValue(movie.active)} disabled />
                                </td>
                                <td>
                                    {genres.map(genre => (
                                        <p>{(genre.id == movie.genreId) ? (genre.name) : ("")}</p>
                                    ))}
                                </td>
                                <td>
                                    <Button type='button' onClick={() => editMovie(movie.id)}>
                                        <Edit size="30" />
                                    </Button>
                                    <Button type='button' onClick={() => deleteMovie(movie.id)}>
                                        <Delete size="25" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </table>
                ) : (
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Creation Date</th>
                            <th>Active</th>
                            <th>Genre</th>
                            <th>Edit</th>
                        </tr>
                        {movies.map(movie => (
                            <tr key={movie.id}>
                                <td>{movie.name}</td>
                                <td>{(new Date(movie.creationDate)).toLocaleDateString()}</td>
                                <td>
                                    <Switch checked={activeValue(movie.active)} disabled />
                                </td>
                                <td>
                                    {genres.map(genre => (
                                        <p>{(genre.id == movie.genreId) ? (genre.name) : ("")}</p>
                                    ))}
                                </td>
                                <td>
                                    <Button type='button' onClick={() => editMovie(movie.id)}>
                                        <Edit size="30" />
                                    </Button>
                                    <Button type='button' onClick={() => deleteMovie(movie.id)}>
                                        <Delete size="25" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </table>
                )}
            </div>
        </section>

    )
}