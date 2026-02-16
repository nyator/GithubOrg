import React, { useState, useMemo } from 'react'
import Header from './components/Header'
import Card from './components/Card'
import Filter from './components/Filter'
import useFetch from './hooks/useFetch'
import Loader from './components/Loader'
import Error from './components/Error'
import Pagination from './components/Pagination'

function App() {
  const [query, setQuery] = useState('')
  const { data, isLoading, error } = useFetch(query)

  // Filter states
  const [timeFilter, setTimeFilter] = useState('Latest')
  const [starsFilter, setStarsFilter] = useState('Stars')
  const [forksFilter, setForksFilter] = useState('Forks')
  const [issuesFilter, setIssuesFilter] = useState('Issues')

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9


  // Compute filtered data
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return []
    let filtered = [...data]

    // Time filter
    const now = new Date()
    if (timeFilter !== 'Latest' && timeFilter !== 'oldest') {
      const monthsAgo = {
        '1 month ago': 1,
        '3 months ago': 3,
        '6 months ago': 6,
        '1 year ago': 12
      }[timeFilter]
      const cutoff = new Date(now.getTime() - monthsAgo * 30 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(repo => new Date(repo.created_at) >= cutoff)
    }

    // Sort by time
    if (timeFilter === 'Latest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (timeFilter === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    }

    // Stars filter
    if (starsFilter !== 'Stars') {
      const minStars = parseInt(starsFilter.replace('+', ''))
      filtered = filtered.filter(repo => repo.stargazers_count >= minStars)
    }

    // Forks filter
    if (forksFilter !== 'Forks') {
      const minForks = parseInt(forksFilter.replace('+', ''))
      filtered = filtered.filter(repo => repo.forks_count >= minForks)
    }

    // Issues filter
    if (issuesFilter === 'open') {
      filtered = filtered.filter(repo => repo.open_issues_count > 0)
    } else if (issuesFilter === 'closed') {
      filtered = filtered.filter(repo => repo.open_issues_count === 0 && repo.has_issues)
    } else if (issuesFilter === 'none') {
      filtered = filtered.filter(repo => !repo.has_issues)
    }

    return filtered
  }, [data, timeFilter, starsFilter, forksFilter, issuesFilter])

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className='flex flex-col items-start justify-center space-y-8 ml-6'>

      <div className='flex gap-4 mb-4 items-end'>
        <Header query={query} setQuery={setQuery} />
        <Filter
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          starsFilter={starsFilter}
          setStarsFilter={setStarsFilter}
          forksFilter={forksFilter}
          setForksFilter={setForksFilter}
          issuesFilter={issuesFilter}
          setIssuesFilter={setIssuesFilter}
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3'>
        {isLoading && (<Loader />)}

        {error && (<Error error={error.message} />)}

        {paginatedData.map(repo => (
          <Card key={repo.id} repo={repo} />
        ))}
      </div>

      {data ?
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
        />

        : null}

    </div>
  )
}

export default App
