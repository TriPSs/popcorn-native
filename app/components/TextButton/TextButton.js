import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'

import dimensions from 'modules/dimensions'

import Typography from 'components/Typography'

import BaseButton from '../BaseButton'

export const styles = {

  root: {
    minWidth: dimensions.QUALITY_WIDTH,
    paddingTop: dimensions.UNIT,
    paddingBottom: dimensions.UNIT,
    textAlign: 'center',
  },

}
export const TextButton = ({
  children,
  innerRef,
  onPress,
  onLongPress,
  onFocus,
  onBlur,
  upperCase,
  component,
  hasTVPreferredFocus,
  nextFocusUp,
  nextFocusDown,
  nextFocusForward,
  nextFocusLeft,
  nextFocusRight,
  nativeID,
  ...rest
}) => (
  <BaseButton
    onPress={onPress}
    onLongPress={onLongPress}
    innerRef={innerRef}
    onFocus={onFocus}
    onBlur={onBlur}
    component={component}
    hasTVPreferredFocus={hasTVPreferredFocus}
    nextFocusUp={nextFocusUp}
    nextFocusDown={nextFocusDown}
    nextFocusForward={nextFocusForward}
    nextFocusLeft={nextFocusLeft}
    nextFocusRight={nextFocusRight}
    rippleBorderless={false}>
    <Text style={[
      styles.root,
      Typography.getTextStyle(rest)
    ]}>
      {children}
    </Text>

  </BaseButton>
)

TextButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  onLongPress: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]).isRequired,
}

TextButton.defaultProps = {
  upperCase: true,
  variant: 'button',
  color: 'white',
  emphasis: 'high',
}

export default TextButton
