import React, { useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator, InteractionManager } from 'react-native'
import { useMutation, useLazyQuery } from '@apollo/react-hooks'
import Orientation from 'react-native-orientation'

import colors from 'modules/colors'
import i18n from 'modules/i18n'
import dimensions from 'modules/dimensions'
import constants from 'modules/constants'
import { StartStreamMutation, StopStreamMutation, DownloadQuery } from 'modules/GraphQL/DownloadGraphQL'

import Typography from 'components/Typography'
import ItemInfo from 'mobile/components/ItemInfo'

import VideoAndControls from './VideoAndControls'
import DownloadInfo from './DownloadInfo'
import PlayerManager from './PlayerManager'

export const Player = ({ route: { params: { item, playQuality } } }) => {
  // TODO:: Move below to PlayerManager
  useEffect(() => {
      // Execute the query after the component is done navigation
      InteractionManager.runAfterInteractions(() => {
        if (!calledStartStream) {
          // Start the stream
          startStream().then(() => {
            executeQuery()
          })
        }
      })

      return () => {
        Orientation.lockToPortrait()

        if (!calledStopStream) {
          // Stop the stream
          stopStream()
        }
      }
    },
    [],
  )

  const [startStream, { called: calledStartStream, loading }] = useMutation(
    StartStreamMutation, { variables: { _id: item._id, itemType: item.type, quality: playQuality } },
  )

  const [stopStream, { called: calledStopStream }] = useMutation(
    StopStreamMutation, { variables: { _id: item._id } },
  )

  const [
    executeQuery, {
      called: queryCalled,
      loading: downloadLoading,
      data: downloadData,
      stopPolling,
    }] = useLazyQuery(
    DownloadQuery,
    {
      pollInterval: 1000,
      skip: queryCalled,
      variables: {
        _id: item._id,
      },
    },
  )

  /**
   * Play a other episode
   *
   * @param item
   * @param torrent
   */
  const playItem = (item, torrent) => {
    // First stop the existing stream
    if (!calledStopStream) {
      // Stop the stream
      stopStream()
    }

    // Stop the current polling
    if (stopPolling) {
      stopPolling()
    }

    // Start the new stream
    startStream({
      variables: {
        _id: item._id,
        itemType: item.type,
        quality: torrent.quality,
      },
    }).then(() => {
      // Start polling the new one
      executeQuery({
        variables: {
          _id: item._id,
        },
      })
    })
  }

  const download = loading || downloadLoading || !downloadData
    ? null
    : downloadData.download

  const isBuffering = loading
                      || downloadLoading
                      || !downloadData
                      || !download
                      || download.progress < 3

  if (download && download.progress === 100) {
    // Stop polling when progress is 100
    stopPolling()
  }

  return (
    <PlayerManager
      item={item}
      isBuffering={isBuffering}
      style={styles.root}>

      {({ casting, renderCastButton, mediaUrl, setProgress, startPosition }) => (
        <React.Fragment>
          {(isBuffering || casting) && (
            <View style={[styles.fullScreen, styles.bufferingContainer]}>

              <ItemInfo
                style={styles.playingInfo}
                item={item}
              />

              {renderCastButton({
                right: (dimensions.SCREEN_WIDTH / 2) - (dimensions.ICON_CAST_SIZE / 2),
                bottom: dimensions.UNIT * 5,
              })}

              {(!casting || isBuffering) && (
                <ActivityIndicator
                  size={50}
                  style={{ marginTop: dimensions.UNIT * 5 }}
                  color={colors.PRIMARY_COLOR_200} />
              )}

              {isBuffering && (
                <React.Fragment>
                  {download && download.status !== constants.STATUS_CONNECTING && (
                    <Typography style={{ marginTop: dimensions.UNIT * 3 }}>
                      {i18n.t('Buffering')}
                    </Typography>
                  )}

                  {!download || download.status === constants.STATUS_CONNECTING && (
                    <Typography style={{ marginTop: dimensions.UNIT * 3 }}>
                      {download ? i18n.t('Connecting') : i18n.t('Queued')}
                    </Typography>
                  )}

                  {download && (
                    <Typography variant={'body2'} style={{ marginTop: dimensions.UNIT / 2 }}>
                      {(download.progress / 3 * 100).toFixed(2)}% / {download.speed}
                    </Typography>
                  )}
                </React.Fragment>
              )}

              {(!isBuffering && download.status !== constants.STATUS_COMPLETE) && (
                <React.Fragment>
                  <Typography style={{ marginTop: dimensions.UNIT * 3 }}>
                    {download.status}
                  </Typography>

                  <Typography variant={'body2'} style={{ marginTop: dimensions.UNIT / 2 }}>
                    {download.progress}% / {download.speed}
                  </Typography>

                  <Typography variant={'body2'} style={{ marginTop: dimensions.UNIT / 2 }}>
                    {download.timeRemaining}
                  </Typography>
                </React.Fragment>
              )}
            </View>
          )}

          {!isBuffering && !casting && download && (
            <VideoAndControls
              item={item}
              url={mediaUrl}
              startPosition={startPosition}
              setProgress={setProgress}
              playOtherEpisode={playItem}>

              <ItemInfo
                style={styles.playingInfoInPlayer}
                item={item}
                truncateSynopsis
              />

              <DownloadInfo
                {...download}
              />

              {renderCastButton({
                right: dimensions.UNIT * 10,
                bottom: dimensions.UNIT * 2.4,
              })}

            </VideoAndControls>
          )}
        </React.Fragment>
      )}

    </PlayerManager>
  )
}

const styles = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: 'black',
  },

  bufferingContainer: {
    backgroundColor: colors.BACKGROUND,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },

  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  playingInfo: {
    marginRight: dimensions.UNIT * 2,
    marginLeft: dimensions.UNIT * 2,
  },

  playingInfoInPlayer: {
    position: 'absolute',
    top: dimensions.UNIT * 3,
    left: dimensions.UNIT * 4,
    zIndex: 1000,
  },

})

export default Player
