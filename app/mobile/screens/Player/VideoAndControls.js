import dimensions from 'modules/dimensions'
import React from 'react'
import VlcPlayer from 'components/VlcPlayer'
import { Dimensions, Slider, StatusBar, StyleSheet, TouchableWithoutFeedback, View, ScrollView } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Orientation from 'react-native-orientation'

import PlayPauseIcon from './PlayPauseIcon'

const { height: windowHeight, width: windowWidth } = Dimensions.get('window')

export class VideoAndControls extends React.Component {

  state = {
    showControls: true,
    isPortrait: true,
    isFirstAnimation: true,

    scrollViewHeight: 0,
    scrollViewHeightWithPlaceholder: 0,

    paused: false,
    resizeMode: 'contain', // 'contain', 'cover', null, 'stretch'

    currentTime: 0,
  }

  scrollViewRef

  videoRef

  controlsTimer = null

  constructor(props) {
    super(props)

    this.today = Date.now()
  }

  componentDidMount() {
    console.log('VideoAndControls', 'mount')
    Orientation.addOrientationListener(this.handleOrientationChange)

    this.toggleControls()
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.handleOrientationChange)
  }

  handleOrientationChange = (orientation) => {
    console.log('handleOrientationChange',orientation)
    if (orientation === 'LANDSCAPE') {
      this.setState({
        isPortrait: false,
      })

      this.videoRef.presentFullscreenPlayer()

    } else if (orientation === 'PORTRAIT') {
      this.setState({
        isPortrait: true,
      })

      this.videoRef.dismissFullscreenPlayer()
    }
  }

  getPlaceholderStyle = () => {
    const { isPortrait } = this.state

    if (isPortrait) {
      return {
        width: windowWidth,
        height: (windowHeight - 20),
        opacity: 0,
        zIndex: 1000,
      }
    }

    return {
      width: (windowHeight),
      height: (windowWidth - 20),
      opacity: 0,
      zIndex: 1000,
    }
  }

  positionScroller = (event = null) => {
    const { scrollViewHeight, scrollViewHeightWithPlaceholder } = this.state

    if (event && (scrollViewHeight / 2) < event.nativeEvent.contentOffset.y) {
      this.scrollViewRef.scrollTo({ y: scrollViewHeightWithPlaceholder, animated: true })

      this.toggleControls(false)

    } else {
      this.toggleControlsOff()

      this.scrollViewRef.scrollTo({ y: 0, animated: true })
    }
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    // Save the content height in state
    this.setState({
      scrollViewHeight: contentHeight - this.getPlaceholderStyle().height,

      scrollViewHeightWithPlaceholder: contentHeight,
    })
  }

  onSliderPositionChange = (position) => {
    this.handlePauseVideo()

    this.setState({
      progress: position,

    }, () => {
      const { duration } = this.state

      this.videoRef.seek(duration / position)
    })
  }

  getEpisodes = () => {
    const { item } = this.props

    let episodes = []

    if (item.type === 'episode') {
      const season = item.show.seasons.find(season => season.number === item.season)

      if (season) {
        episodes = season.episodes
      }
    }

    console.log('episodes', episodes)

    return episodes
  }

  playEpisode = (episode, quality) => {
    const { playOtherEpisode, item } = this.props

    console.log('playEpisode', episode, quality)
    // playOtherEpisode('other', 'https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_h264.mov', {
    //   ...item,
    //   ...episode,
    // })
  }

  handlePauseVideo = () => {
    const { paused } = this.state

    if (paused) {
      return
    }

    this.setState({
      paused: true,

    }, () => {
      this.toggleControls(false)
    })
  }

  handlePlayVideo = (a) => {
    this.setState({
      paused: false,

    }, () => {
      this.toggleControlsOff()
    })
  }

  handleVideoLoad = (data) => {
    const { currentTime } = this.state

    this.setState({
      duration: data.duration,
      loading: false,

      isFirstAnimation: false,
    }, () => {
      if (currentTime > 0) {
        this.videoRef.seek(currentTime)
      }

      // Orientation.unlockAllOrientations()
    })
  }

  handleVideoProgress = ({ currentTime }) => {
    const { duration } = this.state

    this.setState({
      currentTime,
      progress: parseInt((parseInt(currentTime) / parseInt(duration)) * 100),
    })
  }

  toggleControls = (withTimeout = true) => {
    const { showControls } = this.state
    console.log('toggleControls')
    if (this.controlsTimer) {
      clearTimeout(this.controlsTimer)
    }

    if (showControls === true) {
      if (withTimeout) {
        return this.toggleControlsOff()
      }

      return
    }

    this.setState({
      showControls: true,
    }, () => {
      if (withTimeout) {
        return this.toggleControlsOff()
      }
    })
  }

  toggleControlsOff = () => {
    const { showControls, paused } = this.state

    if (!showControls || paused) {
      return
    }

    this.controlsTimer = setTimeout(() => {
      this.setState({
        showControls: false,
      })
    }, 2200)
  }

  render() {
    const { url, item, children, forcePaused } = this.props
    const { isPortrait, resizeMode, progress } = this.state
    //const { showControls, paused } = this.state

    const showControls = true
    const paused = true

    return (
      <React.Fragment>
        {/*<StatusBar*/}
        {/*  hidden={!paused && !isPortrait}*/}
        {/*  animated />*/}

        {url && (
          <VlcPlayer
            ref={(ref) => {
              this.videoRef = ref

              console.log('videoRef', this.videoRef)
            }}
            source={{
              uri: url,
              autoplay: true,
              // initOptions: ['--codec=avcodec'],
            }}
            style={styles.video}
            paused={paused || forcePaused}

            // onVLCProgress={this.handleVideoProgress}
            onVLCProgress={(...a) => {
              console.log('onVLCProgress', a)
              console.log('onVLCProgress')
            }}
            onVLCEnded={(...a) => {
              Orientation.lockToPortrait()

              console.log('onVLCEnded')
              console.log('onVLCEnded', a)
            }}
            onVLCStopped={(...a) => {
              Orientation.lockToPortrait()

              console.log('onVLCStopped')
              console.log('onVLCStopped', a)
            }}
            onVLCPlaying={(...a) => {
              Orientation.lockToLandscape()

              console.log('onVLCPlaying')
              console.log('onVLCPlaying', a)
            }}
            onVLCBuffering={(...a) => {
              console.log('onVLCBuffering')
              console.log('onVLCBuffering', a)
            }}
            onVLCPaused={(...a) => {
              console.log('onVLCPaused')
              console.log('onVLCPaused', a)
            }}


            // volume={1}
            // rate={1}
            // muted={false}
            // resizeMode={resizeMode}
            // onLoad={this.handleVideoLoad}
            // onError={console.warn}
            // onAudioBecomingNoisy={this.handlePauseVideo}
            // onSeek={this.handlePlayVideo}
            // repeat={false}
          />
        )}

        {/*<Animatable.View*/}
        {/*  style={[styles.listContainer]}*/}
        {/*  animation={showControls ? 'fadeIn' : 'fadeOut'}*/}
        {/*  pointerEvents={'box-none'}*/}
        {/*  useNativeDriver>*/}

        {/*  <PlayPauseIcon*/}
        {/*    isPortrait={isPortrait}*/}
        {/*    handlePlayVideo={this.handlePlayVideo}*/}
        {/*    handlePauseVideo={this.handlePauseVideo}*/}
        {/*    paused={paused}*/}
        {/*  />*/}

        {/*  <Slider*/}
        {/*    value={progress}*/}
        {/*    thumbTintColor={'#FFF'}*/}
        {/*    minimumTrackTintColor={'#FFF'}*/}
        {/*    maximumTrackTintColor={'#FFF'}*/}
        {/*    maximumValue={100}*/}
        {/*    step={5}*/}
        {/*    disabled*/}
        {/*    style={styles.slider}*/}
        {/*    onValueChange={this.onSliderPositionChange} />*/}

        {/*  <ScrollView*/}
        {/*    ref={ref => this.scrollViewRef = ref}*/}
        {/*    showsHorizontalScrollIndicator={false}*/}
        {/*    showsVerticalScrollIndicator={false}*/}
        {/*    contentContainerStyle={styles.contentContainerStyle}*/}
        {/*    onScroll={this.toggleControls}*/}
        {/*    scrollEnabled={showControls}*/}
        {/*    onScrollEndDrag={this.positionScroller}*/}
        {/*    onContentSizeChange={this.onContentSizeChange}>*/}

        {/*    <View style={[styles.overlay]} />*/}

        {/*    <TouchableWithoutFeedback onPress={this.toggleControls}>*/}
        {/*      <View style={this.getPlaceholderStyle()} />*/}
        {/*    </TouchableWithoutFeedback>*/}

        {/*    /!*<ScrollView*!/*/}
        {/*    /!*  showsHorizontalScrollIndicator={false}*!/*/}
        {/*    /!*  showsVerticalScrollIndicator={false}*!/*/}
        {/*    /!*  onScroll={() => this.toggleControls(false)}*!/*/}
        {/*    /!*  scrollEventThrottle={10}*!/*/}
        {/*    /!*  contentContainerStyle={{*!/*/}
        {/*    /!*    flexGrow: 1,*!/*/}
        {/*    /!*    backgroundColor: 'green',*!/*/}
        {/*    /!*  }}*!/*/}
        {/*    /!*  horizontal>*!/*/}

        {/*    /!*  {this.getEpisodes().map(episode => (*!/*/}
        {/*    /!*    <Episode*!/*/}
        {/*    /!*      variant={'player'}*!/*/}
        {/*    /!*      key={episode._id}*!/*/}
        {/*    /!*      playItem={this.playEpisode}*!/*/}
        {/*    /!*      hasAired={episode.firstAired < this.today}*!/*/}
        {/*    /!*      {...episode} />*!/*/}
        {/*    /!*  ))}*!/*/}

        {/*    /!*</ScrollView>*!/*/}

        {/*  </ScrollView>*/}

        {/*</Animatable.View>*/}

      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({

  listContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1000,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.6,
    flex: 1,

    backgroundColor: '#000',
  },

  contentContainerStyle: {
    flexGrow: 1,
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },

  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  slider: {
    position: 'absolute',
    left: 16,
    bottom: 64,
    right: 16,
    zIndex: 1001,
  },

})


export default VideoAndControls
