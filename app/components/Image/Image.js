import React from 'react'
import PropTypes from 'prop-types'
import { Image as RnImage, StyleSheet } from 'react-native'

import posterHolderImage from 'assets/images/posterholder.png'

const styles = StyleSheet.create({

  image: {
    height: '100%',
    width: '100%',
  },

})

// https://github.com/DylanVann/react-native-fast-image
// https://github.com/DylanVann/react-native-fast-image#sourcecache-enum

export default class Image extends React.PureComponent {

  static getDerivedStateFromProps(props) {
    const { images, type, size, empty } = props

    return {
      showPlaceholder: empty || !images || !images[type] || !images[type][size],
    }
  }

  static propTypes = {
    images: PropTypes.object.isRequired,
    type: PropTypes.oneOf([
      'poster',
      'backdrop',
    ]),
    size: PropTypes.string,
    style: PropTypes.object,
    withFallback: PropTypes.bool,
    empty: PropTypes.bool,
    resizeMode: PropTypes.string,
  }

  static defaultProps = {
    type: 'poster',
    size: 'thumb',
    resizeMode: 'stretch',
    style: null,
    withFallback: true,
    empty: false,
  }

  state = {
    showPlaceholder: false,
  }

  getImage = () => {
    const { images, withFallback, type, size, empty } = this.props
    const { showPlaceholder } = this.state

    if (showPlaceholder || empty) {
      if (withFallback) {
        return posterHolderImage
      }

      return null
    }

    return { uri: images[type][size] }
  }

  handleImageError = () => {
    this.setState({
      showPlaceholder: true,
    })
  }

  render() {
    const { images, withFallback, resizeMode, style, ...props } = this.props
    const { showPlaceholder } = this.state

    return (
      <RnImage
        resizeMode={
          showPlaceholder
            ? 'center'
            : resizeMode
        }
        style={[
          styles.image,
          style,
        ]}
        onError={this.handleImageError}
        source={this.getImage()}
        {...props}
      />
    )
  }

}
