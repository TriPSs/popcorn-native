import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, ActivityIndicator } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { material } from 'react-native-typography'
import { withNavigation } from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import dimensions from 'modules/dimensions'
import i18n from 'modules/i18n'

import BaseButton from 'components/BaseButton'
import Button from 'components/Button'
import Typography from 'components/Typography'
import Modal from 'components/Modal'

import colors from 'modules/colors'

const styles = StyleSheet.create({

  root: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  listContainer: {
    opacity: 0.9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.BACKGROUND,
  },

  closeIcon: {
    position: 'absolute',
    top: 34,
    right: 14,
  },

  qualityContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  quality: {
    ...material.titleWhiteObject,
    margin: 8,

    borderBottomWidth: 1,
  },

  searchForBetter: {
    position: 'absolute',
    bottom: 20,
  },

  fetchingBetter: {
    position: 'absolute',
    top: 100,
  },
})

@withNavigation
export default class QualitySelector extends React.Component {

  static propTypes = {
    style: PropTypes.object,

    isMyEpisode: PropTypes.bool,
    fetchingBetter: PropTypes.bool,
  }

  static defaultProps = {
    iconSize: dimensions.ICON_PLAY_MEDIUM,
    style: {},

    isMyEpisode: false,
  }

  handlePlayTorrent = (torrent) => {
    const { item, onRequestClose, navigation: { navigate } } = this.props

    console.log('handlePlayTorrent', torrent)
    // Close the selector
    onRequestClose()

    navigate('Player', {
      playQuality: torrent.quality,
      item,
    })
  }

  render() {
    const { visible, onRequestClose, iconSize } = this.props
    const { style, item } = this.props

    return (
      <React.Fragment>

        <Icon
          style={style}
          name={'play-circle-outline'}
          color={colors.ICON_COLOR}
          size={iconSize} />

        <Modal
          onRequestClose={onRequestClose}
          visible={visible}>

          {item.torrents.length === 0 && (
            <Typography variant={'title'}>
              {i18n.t('No qualities available! Try to search')}
            </Typography>
          )}

          {item.torrents.map((torrent) => (
            <Animatable.View
              key={torrent.quality}
              animation={'fadeIn'}
              duration={200}
              useNativeDriver>
              <BaseButton onPress={() => this.handlePlayTorrent(torrent)}>
                <Text style={[
                  styles.quality,
                  // {
                  //   borderBottomColor: item.torrents
                  //     ? item.torrents[quality].health.color
                  //     : null,
                  // },
                ]}>
                  {torrent.quality}
                </Text>
              </BaseButton>
            </Animatable.View>
          ))}

        </Modal>

      </React.Fragment>
    )

  }

}