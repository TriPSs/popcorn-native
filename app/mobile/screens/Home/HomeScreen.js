import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { useQuery } from '@apollo/client'
import Orientation from 'react-native-orientation'
import SplashScreen from 'react-native-splash-screen'
import { CastButton } from 'react-native-google-cast'

import i18n from 'modules/i18n'
import dimensions from 'modules/dimensions'
import colors from 'modules/colors'
import fetchMoreUpdateQuery from 'modules/GraphQL/helpers/fetchMoreUpdateQuery'
import MoviesQuery from 'modules/GraphQL/MoviesGraphQL'

import CardSlider from 'components/CardSlider'
import ScrollViewWithStatusBar from 'components/ScrollViewWithStatusBar'
import Container from 'components/Container'
import MainCover from 'mobile/components/MainCover'

import ShowsSlider from './ShowsSlider'
import MostWatchedShowsSlider from './MostWatchedShowsSlider'
import BookmarksSlider from './BookmarksSlider'
import MyEpisodesSlider from './MyEpisodesSlider'
import SettingsIcon from './SettingsIcon'

export const styles = StyleSheet.create({

  root: {
    flex: 1,
    position: 'relative',

    width: '100%',
  },

  lastSection: {
    marginBottom: dimensions.UNIT * 4,
  },

  castButton: {
    position: 'absolute',
    top: dimensions.STATUSBAR_HEIGHT - (dimensions.UNIT / 4),
    right: dimensions.UNIT * 2 + dimensions.ICON_SIZE_DEFAULT,

    width: dimensions.ICON_CAST_SIZE,
    height: dimensions.ICON_CAST_SIZE,
    tintColor: colors.ICON.WHITE
  },

})

export const Home = ({ navigation }) => {
  const { data: moviesData, fetchMore: moviesFetchMore} = useQuery(
    MoviesQuery,
    {
      variables: {
        offset: 0,
      },
    },
  )

  useEffect(() => {
    Orientation.lockToPortrait()
    SplashScreen.hide()

    return () => {
      Orientation.unlockAllOrientations()
    }
  }, [])

  const handleGoTo = (to) => () => {
    navigation.navigate(to)
  }

  const handleItemOpen = (item) => {
    navigation.navigate('Item', item)
  }

  const noMoviesYet = !moviesData || !moviesData.movies

  // Filter out bookmarks, when adding then this data is updated
  const movies = noMoviesYet
    ? null
    : moviesData.movies
      .filter((movie) => !movie.bookmarked)
      .filter((movie) => !movie.watched.complete)

  return (
    <ScrollViewWithStatusBar>
      <Container>

        <MainCover
          handleItemOpen={handleItemOpen}
          handleItemPlay={handleItemOpen}
          empty={noMoviesYet}
          item={noMoviesYet
            ? null
            : movies[0]
          } />

        <SettingsIcon />

        <CastButton style={styles.castButton} />

        <BookmarksSlider
          handleGoTo={handleGoTo}
          onPress={handleItemOpen}
        />

        <MyEpisodesSlider />

        <CardSlider
          onPress={handleItemOpen}
          title={i18n.t('Movies')}
          items={noMoviesYet ? [] : [...movies].slice(1)}
          goToMore={handleGoTo('Movies')}
          onEndReached={fetchMoreUpdateQuery('movies', moviesData, moviesFetchMore)}
        />

        <ShowsSlider
          handleGoTo={handleGoTo}
          onPress={handleItemOpen}
        />

        <MostWatchedShowsSlider
          onPress={handleItemOpen}
        />

      </Container>
    </ScrollViewWithStatusBar>
  )
}

export default Home
