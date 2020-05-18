import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, StatusBar, Animated, InteractionManager } from 'react-native'
import { useLazyQuery } from '@apollo/react-hooks'
import { useCollapsibleStack } from 'react-navigation-collapsible'
import { getDefaultHeaderHeight } from 'react-navigation-collapsible/lib/src/utils'

import i18n from 'modules/i18n'
import colors from 'modules/colors'
import dimensions from 'modules/dimensions'
import MoviesQuery from 'modules/GraphQL/MoviesQuery'
import ShowsQuery from 'modules/GraphQL/ShowsQuery'
import BookmarksQuery from 'modules/GraphQL/BookmarksQuery'
import fetchMoreUpdateQuery from 'modules/GraphQL/helpers/fetchMoreUpdateQuery'

import Card from 'components/Card'
import Typography from 'components/Typography'
import SearchBar from './SearchBar'

const styles = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  },

  container: {
    marginTop: dimensions.UNIT / 2,
    marginLeft: dimensions.UNIT / 2,
    marginRight: dimensions.UNIT / 2,
    paddingBottom: dimensions.UNIT * 2,
  },

  noResults: {
    marginTop: dimensions.UNIT * 2,
    textAlign: 'center',
  },
})

export const Mode = ({ mode, navigation }) => {
  const flatListRef = useRef(null)
  const [query, setQuery] = useState(null)
  const [executeQuery, { loading, data, fetchMore }] = useLazyQuery(
    mode === 'movies'
      ? MoviesQuery
      : mode === 'shows'
      ? ShowsQuery
      : BookmarksQuery,
    {
      variables: {
        offset: 0,
        query,
      },
    },
  )

  const { onScroll, scrollIndicatorInsetTop } = useCollapsibleStack()

  useEffect(() => {
    // Execute the query after the component is done navigation
    InteractionManager.runAfterInteractions(() => {
      // Execute the query
      executeQuery()
    })
  }, [])

  const items = !data || !data[mode]
    ? []
    : data[mode]

  const renderCard = ({ item }) => {
    const empty = item.loading

    return (
      <Card
        variant={'small'}
        empty={empty}
        item={item}
        onPress={() => {
          if (!empty && !loading) {
            navigation.navigate('Item', item)
          }
        }}
      />
    )
  }

  const renderNothingFound = () => (
    <Typography
      style={styles.noResults}
      variant={'subtitle1'}>
      {i18n.t('No results found')}
    </Typography>
  )

  return (
    <View style={styles.root}>

      <StatusBar
        backgroundColor={colors.STATUS_BAR_TRANSPARENT}
        animated />

      <Animated.FlatList
        removeClippedSubviews
        ref={flatListRef}
        data={items.length === 0 && !query
          ? Array(24).fill({ loading: true })
          : items
        }
        scrollEnabled={items.length > 0}
        numColumns={4}
        initialNumToRender={24}
        windowSize={24}
        renderItem={renderCard}
        ListEmptyComponent={renderNothingFound}
        ListHeaderComponent={() => (
          <View style={{
            marginTop: 50 + dimensions.STATUSBAR_HEIGHT + dimensions.UNIT,
          }} />
        )}
        ListFooterComponent={() => <View style={{ width: dimensions.UNIT * 2 }} />}
        keyExtractor={(item, index) => item
          ? `${item._id}-${index}`
          : `${index}`
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchMoreUpdateQuery(mode, data, fetchMore)}
        onEndReachedThreshold={3}
        onScroll={onScroll}
        contentContainerStyle={styles.container}
        scrollIndicatorInsets={{ top: scrollIndicatorInsetTop - getDefaultHeaderHeight(true) }}
      />

      <SearchBar
        flatListRef={flatListRef}
        searchedQuery={query}
        search={setQuery} />

    </View>
  )
}

Mode.propTypes = {
  mode: PropTypes.oneOf(['movies', 'shows', 'bookmarks']).isRequired,
}

export default Mode
