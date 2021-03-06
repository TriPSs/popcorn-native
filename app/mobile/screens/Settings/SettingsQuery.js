import { gql } from '@apollo/client'

export const AboutQuery =  gql`
  query {
    
    status {
      version
      totalMovies
      totalShows
      disk {
        free
        used
        size
        freePercentage
        usedPercentage
        sizePercentage
      }
    }
    
    scraper {
      status
      version
      uptime
      updated
      nextUpdate
    }
    
  }
`
