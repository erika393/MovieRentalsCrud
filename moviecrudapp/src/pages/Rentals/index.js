import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button } from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import api from '../../services/api'
import './style.css'
import Header from '../../components/Header'

export default function Rentals() {

    const [searchInput, setSearchInput] = useState('')
    const [filter, setFilter] = useState([])

    const [rentals, setRentals] = useState([])

    const [moviesId, setMoviesId] = useState([])

    //recuperando o token do localStorage
    const token = localStorage.getItem('token')

    const history = useHistory()

    const authorization = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const searchRentals = (searchValue) => {
        setSearchInput(searchValue)
        if (searchInput !== '') {
            const dataReturn = rentals.filter((item) => {
                return Object.values(item).join('').toLowerCase()
                    .includes(searchInput.toLowerCase())
            })
            setFilter(dataReturn)
        } else {
            setFilter(rentals)
        }
    }

    //lidando com os efeitos colaterais do request e pegando os dados dos rentals
    useEffect(() => {
        api.get('api/movies', authorization).then(
            response => {
                setMoviesId(response.data)
            }, token)
        api.get('api/rentals', authorization).then(
            response => {
                setRentals(response.data)
            }, token)
    })

    async function editRental(id) {
        try {
            history.push(`rental/new/${id}`)
        } catch (error) {
            alert('Unable to edit rental')
        }
    }

    async function deleteRental(id) {
        try {
            if (window.confirm('Want to delete rental id ' + id + '?')) {
                await api.delete(`api/rentals/${id}`, authorization)
                setRentals(rentals.filter(rental => rental.id !== id))
            }
        } catch (error) {
            alert('Unable to delete rental ' + error)
        }
    }

    return (
        <div className='rental-container'>
            <header>
                <Header />
                <Link className="button float-end m-4" to="rental/new/0">Create Rental</Link>
            </header>
            <div className='search-div'>
                    <input type='text' placeholder="Search a rental..." onChange={(e) => searchRentals(e.target.value)} /><Search className='text-white' />
                </div>
            <h1>RENTALS</h1>

            {searchInput.length > 0 ? (
                <table>
                    <tr>
                        <th>Movies</th>
                        <th>CPF Client</th>
                        <th>Rental Date</th>
                        <th>Edit</th>
                    </tr>
                    {filter.map(rental => (
                        <tr key={rental.id}>
                            <td>
                                {moviesId.map(movie => (
                                    <p>{(movie.rentalId == rental.id) ? (movie.name) : ('')}</p>
                                ))}
                            </td>
                            <td>{rental.cpfClient}</td>
                            <td>{(new Date(rental.rentalDate)).toLocaleDateString()}</td>
                            <td>
                                <Button type='button' onClick={() => editRental(rental.id)}>
                                    <Edit size="30" />
                                </Button>
                                <Button type='button' onClick={() => deleteRental(rental.id)}>
                                    <Delete size="25" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </table>
            ) : (
                <table>
                    <tr>
                        <th>Movies</th>
                        <th>CPF Client</th>
                        <th>Rental Date</th>
                        <th>Edit</th>
                    </tr>
                    {rentals.map(rental => (
                        <tr key={rental.id}>
                            <td>
                                {moviesId.map(movie => (
                                    <p>{(movie.rentalId == rental.id) ? (movie.name) : ('')}</p>
                                ))}
                            </td>
                            <td>{rental.cpfClient}</td>
                            <td>{(new Date(rental.rentalDate)).toLocaleDateString()}</td>
                            <td>
                                <Button type='button' onClick={() => editRental(rental.id)}>
                                    <Edit size="30" />
                                </Button>
                                <Button type='button' onClick={() => deleteRental(rental.id)}>
                                    <Delete size="25" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </table>
            )}
        </div>
    )
}