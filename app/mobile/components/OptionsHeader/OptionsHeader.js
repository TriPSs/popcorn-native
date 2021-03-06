import React from 'react'
import { StyleSheet } from 'react-native'

import dimensions from 'modules/dimensions'
import Divider from 'components/Divider'

import OptionsItem from '../OptionsItem'

export const styles = StyleSheet.create({

  root: {
    marginVertical: dimensions.UNIT * 2,
  },

})

export const SettingsHeader = ({ label }) => {
  return (
    <>
      <OptionsItem
        style={styles.root}
        label={label}
      />

      <Divider />
    </>
  )
}

export default SettingsHeader
