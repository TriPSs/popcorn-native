import { gql } from '@apollo/client'

export const MovieQuery = gql`
  query movie($_id: String!) {
    item: movie(_id: $_id) {
      _id
      title
      genres
      synopsis
      type
      bookmarked
      trailer
      rating {
        percentage
      }
      watched {
        complete
        progress
      }
      download {
        downloadStatus
        downloading
        downloadComplete
        downloadQuality
      }
      torrents {
        quality
        sizeString
        type
      }
      searchedTorrents {
        quality
        sizeString
        type
      }
      images {
        backdrop {
          full
          high
        }
        poster {
          thumb
          high
        }
      }
    }
  }
`

export const EpisodeQuery = gql`
  query episode($_id: String!) {
    item: episode(_id: $_id) {
      _id
      title
      number
      season
      synopsis
      firstAired
      type
      watched {
        complete
        progress
      }
      download {
        downloadStatus
        downloading
        downloadComplete
        downloadQuality
      }
      images {
        poster {
          thumb
          high
        }
      }
      torrents {
        quality
        sizeString
        type
      }
      searchedTorrents {
        quality
        sizeString
        type
      }
      show {
        title 
        images {
          backdrop {
            full
          }
          poster {
            thumb
            high
          }
        }
      }
    }
  }
`
