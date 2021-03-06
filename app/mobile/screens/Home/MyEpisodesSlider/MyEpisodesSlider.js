import React from 'react'
import { useQuery } from '@apollo/client'

import i18n from 'modules/i18n'
import MyEpisodesQuery from 'modules/GraphQL/EpisodesGraphQL'

import EpisodesSlider from 'components/MyEpisodesSlider'

export const MyEpisodesSlider = () => {
  const { loading, data } = useQuery(
    MyEpisodesQuery,
    {
      variables: {
        offset: 0,
      },
    },
  )

  return (
    <EpisodesSlider
      title={i18n.t('My Episodes')}
      items={!data || !data.episodes ? [] : data.episodes.filter(episode => !episode.watched.complete)}
      loading={loading}
    />
  )
}

MyEpisodesSlider.propTypes = {}

export default MyEpisodesSlider
