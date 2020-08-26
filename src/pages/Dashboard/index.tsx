import React, { useState, useEffect, FormEvent } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { Title, Form, Repositories, Error } from './styles'

import logo from '../../assets/img/logo.svg'
import api from '../../services/api'

interface Repository {
  full_name: string,
  description?: string,
  owner: {
    avatar_url: string,
    login: string
  }
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('')
  const [inputError, setInputError] = useState('')
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepo = localStorage.getItem('@lab:repositories')
    if (!!storagedRepo) {
      return JSON.parse(storagedRepo)
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('@lab:repositories', JSON.stringify(repositories))
  }, [repositories])

  async function handleNewRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (!inputError)
      setInputError('Digite o autor/nome do repositório')
    else
      try {
        const { data } = await api.get<Repository>(`repos/${newRepo}`)
        setRepositories([...repositories, data])
        setNewRepo('')
        setInputError('')
      } catch (error) {
        setInputError('Erro na busca do repositório')
      }
  }

  return (
    <>
      <img src={logo} alt='Github Explorer' />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleNewRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder='Digite o nome do repositório ex. facebook/react'
        />
        <button type='submit'>Pesquisar</button>
      </Form>
      {!!inputError && (
        <Error>{inputError}</Error>
      )}
      <Repositories>
        {repositories.map(repository => (
          <Link to={`repository/${repository.full_name}`} key={repository.full_name}  >
            <img src={repository.owner.avatar_url} alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>

              <p>{repository.description || ''}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  )
}

export default Dashboard