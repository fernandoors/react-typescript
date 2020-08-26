import React, { useEffect, useState } from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import { Header, RepositoryInfo, Issues } from './styles'
import logo from '../../assets/img/logo.svg'
import api from '../../services/api'

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string,
  description?: string,
  forks_count: number,
  stargazers_count: number,
  open_issues_count: number,
  owner: {
    avatar_url: string,
    login: string
  }
}

interface Issue {
  title: string,
  id: string,
  html_url: string,
  user: {
    login: string,
  }
}

const Repository: React.FC = () => {
  const [repository, setRepository] = useState<Repository | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])

  const { params } = useRouteMatch<RepositoryParams>()

  useEffect(() => {
    api.get(`repos/${params.repository}`).then((response) => {
      setRepository(response.data)
    })
    api.get(`repos/${params.repository}/issues`).then((response) => {
      setIssues(response.data)
    })
  }, [params.repository])
  return (
    <>
      <Header>
        <img src={logo} alt='Github Explorer' />
        <Link to='/' >
          <FiChevronLeft size={16} />
          voltar
        </Link>
      </Header>

      <RepositoryInfo>
        <header>
          <img src={repository?.owner.avatar_url} alt={repository?.owner.login} />
          <div>
            <strong>{repository?.full_name}</strong>
            <p>{repository?.description}</p>
          </div>
        </header>
        <ul>
          <li>
            <strong>{repository?.stargazers_count}</strong>
            <p>Stars</p>
          </li>
          <li>
            <strong>{repository?.forks_count}</strong>
            <p>Forks</p>
          </li>
          <li>
            <strong>{repository?.open_issues_count}</strong>
            <p>Issues</p>
          </li>
        </ul>

        <Issues>
          {issues.map(issue => (
            <a key={issue.id} href={issue.html_url} target='_blank' rel="noopener noreferrer">
              <div>
                <strong>{issue.title}</strong>
                <p>issue.user.login</p>
              </div>
              <FiChevronRight size={20} />
            </a>
          ))}
        </Issues>
      </RepositoryInfo>
    </>
  )
}

export default Repository 