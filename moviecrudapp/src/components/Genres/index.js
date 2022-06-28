import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Switch } from '@mui/material';
import { Edit, Search } from '@mui/icons-material';
import api from '../../services/api'
import './style.css'
import Layout from '../Layout'
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Genres() {

    const [searchInput, setSearchInput] = useState('')
    const [filter, setFilter] = useState([])
    const [genres, setGenres] = useState([])

    //recuperando o token do localStorage
    const email = localStorage.getItem('email')
    const token = localStorage.getItem('token')

    const history = useHistory()

    const authorization = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const searchGenres = (searchValue) => {
        setSearchInput(searchValue)
        if (searchInput !== '') {
            //filtrando os itens que tem o mesmo valor que o searchValue
            const dataReturn = genres.filter((item) => {
                return Object.values(item).join('').toLowerCase()
                    .includes(searchInput.toLowerCase())
            })
            setFilter(dataReturn)
        } else {
            setFilter(genres)
        }
    }
    
    //lidando com os efeitos colaterais do request e pegando os dados dos genres
    useEffect(() => {
        api.get('api/genres', authorization).then(
            response => {
                setGenres(response.data)
            }, token)
    })

    //controlando o switch
    function activeValue(active) {
        if (active) {
            return true
        } else {
            return false
        }
    }

    async function editGenre(id) {
        try {
            history.push(`genre/new/${id}`)
        } catch (error) {
            alert('Unable to edit genre')
        }
    }

    return (
        <div className='genre-container'>
            <header>
                <Layout />
                <Link className="button m-4 float-end" to="genre/new/0">Create Genre</Link>
            </header>
            <div className='search-div'>
                <input type='text' placeholder="Search a genre..." onChange={(e) => searchGenres(e.target.value)} /><Search className='text-white' />
            </div>
            <h1>GENRES</h1>
            {/** se a caixa de pesquisa possui mais de 0 caracteres sera renderizado os itens que possui aquele caracter */}
            {searchInput.length > 0 ? (
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Creation Date</th>
                        <th>Active</th>
                        <th>Edit</th>
                    </tr>
                    {/*filtra os generos que possui os caracteres da caixa de pesquisa*/}
                    {filter.map(genre => (
                        <tr key={genre.id}>
                            <td>{genre.name}</td>
                            <td>{(new Date(genre.creationDate)).toLocaleDateString()}</td>
                            <td><Switch checked={activeValue(genre.active)} disabled /></td>
                            <td>
                                <Button type='button' onClick={() => editGenre(genre.id)}>
                                    <Edit size="30" />
                                </Button>

                            </td>
                        </tr>
                    ))}
                </table>
            ) : (
                <table>
                    {/*se nao renderiza normalmente*/}
                    <tr>
                        <th>Name</th>
                        <th>Creation Date</th>
                        <th>Active</th>
                        <th>Edit</th>
                    </tr>
                    {/*mapeando os generos e mostrando na tela*/}
                    {genres.map(genre => (
                        <tr key={genre.id}>
                            <td>{genre.name}</td>
                            <td>{(new Date(genre.creationDate)).toLocaleDateString()}</td>
                            <td><Switch checked={activeValue(genre.active)} disabled /></td>
                            <td>
                                <Button type='button' onClick={() => editGenre(genre.id)}>
                                    <Edit size="30" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </table>
            )}

        </div>
    )
}