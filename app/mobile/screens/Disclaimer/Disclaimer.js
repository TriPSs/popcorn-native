import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, BackHandler, View, ScrollView, StatusBar, TouchableNativeFeedback } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Markdown from 'react-native-markdown-renderer'
import SplashScreen from 'react-native-splash-screen'

import i18n from 'modules/i18n'
import colors from 'modules/colors'
import dimensions from 'modules/dimensions'
import Settings from 'modules/db/Settings'

import Typography from 'components/Typography'
import Button from 'components/Button'

export const styles = StyleSheet.create({

  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,

    backgroundColor: colors.BACKGROUND,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    marginTop: dimensions.STATUSBAR_HEIGHT + dimensions.UNIT,
    marginBottom: dimensions.UNIT,
  },

  loader: {
    display: 'flex',
    alignItems: 'center',
  },

  bodyScroll: {
    width: '100%',
    maxHeight: '100%',

    paddingLeft: dimensions.UNIT * 2,
    paddingRight: dimensions.UNIT * 2,
  },

  bodyContainer: {
    paddingBottom: 48,
  },

  actions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',

    position: 'absolute',
    bottom: 8,
    right: 0,
    left: 0,
  },

  action: {
    margin: 4,
  },
})

export const mdStyle = StyleSheet.create({

  heading1: Typography.getTextStyle({
    variant: 'subtitle1',
    asObject: true,
  }),

  heading2: Typography.getTextStyle({
    variant: 'subtitle2',
    asObject: true,
  }),

  text: Typography.getTextStyle({
    variant: 'body2',
    asObject: true,
  }),

})

export default class Disclaimer extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  state = {
    accepted: null,
    animating: false,
  }

  componentDidMount() {
    Settings.getItem(Settings.DISCLAIMER_ACCEPTED).then((accepted) => {
      this.setState({
        accepted: !!(accepted && accepted === 'y'),
      }, () => {
        if (!accepted) {
          SplashScreen.hide()
        }
      })
    })
  }

  handleAnimationEnd = () => {
    this.setState({
      animating: false,
    })
  }

  handleLeave = () => {
    BackHandler.exitApp()
  }

  handleAccept = () => {
    this.setState({
      accepted: true,
      animating: true,
    }, () => {
      Settings.setItem(Settings.DISCLAIMER_ACCEPTED, 'y')
    })
  }

  render() {
    const { children } = this.props
    const { animating, accepted } = this.state

    return (
      <React.Fragment>

        {accepted && (children)}

        {(!accepted || animating) && accepted !== null && (
          <Animatable.View
            animation={!accepted
              ? 'fadeIn'
              : 'fadeOut'
            }
            duration={500}
            style={styles.root}
            onAnimationEnd={this.handleAnimationEnd}
            useNativeDriver>

            <StatusBar
              animated
              translucent
              backgroundColor={colors.BACKGROUND} />

            <Typography
              variant={'headline6'}
              style={styles.title}>
              {i18n.t('Terms of Service')}
            </Typography>

            <ScrollView
              showshorizontalscrollindicator={false}
              style={styles.bodyScroll}>
              <View style={styles.bodyContainer}>
                <Markdown style={mdStyle}>
                  {`## Your Acceptance
By using the Popcorn Time app you signify your agreement to (1) these terms and conditions (the 'Terms of Service').

## Privacy Policy.
You understand that by using Popcorn Time you may encounter material that you may deem to be offensive, indecent, or objectionable, and that such content may or may not be identified as having explicit material. Popcorn Time will have no liability to you for such material – you agree that your use of Popcorn Time is at your sole risk.

## DISCLAIMERS
YOU EXPRESSLY AGREE THAT YOUR USE OF POPCORN TIME IS AT YOUR SOLE RISK. POPCORN TIME AND ALL PRODUCTS ARE PROVIDED TO YOU “AS IS” WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. POPCORN TIME MAKES ABSOLUTELY NO WARRANTIES WHATSOEVER, EXPRESS OR IMPLIED. TO THE FULLEST EXTENT POSSIBLE UNDER APPLICABLE LAWS, YIFY DISCLAIMS ALL WARRANTIES, EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR OTHER VIOLATIONS OF RIGHTS.

## LIMITATION OF LIABILITY
POPCORN TIME IS NOT RESPONSIBLE FOR ANY PROBLEMS OR TECHNICAL MALFUNCTION OF ANY WEBSITE, NETWORK, COMPUTER SYSTEMS, SERVERS, PROVIDERS, COMPUTER EQUIPMENT, OR SOFTWARE, OR FOR ANY FAILURE DUE TO TECHNICAL PROBLEMS OR TRAFFIC CONGESTION ON THE INTERNET OR POPCORN TIME OR COMBINATION THEREOF, INCLUDING ANY INJURY OR DAMAGE TO USERS OR TO ANY COMPUTER OR OTHER DEVICE ON OR THROUGH WHICH POPCORN TIME IS PROVIDED. UNDER NO CIRCUMSTANCES WILL POPCORN TIME BE LIABLE FOR ANY LOSS OR DAMAGE, INCLUDING PERSONAL INJURY OR DEATH, RESULTING FROM YOUR USE OF Popcorn time.

## SOURCE MATERIAL
ALL MOVIES ARE NOT HOSTED ON ANY SERVER AND ARE STREAMED USING THE P2P BIT TORRENT PROTOCOL. ALL MOVIES ARE PULLED IN FROM OPEN PUBLIC APIS. BY WATCHING A MOVIE WITH THIS APPLICATION YOU MIGHT BE COMMITTING COPYRIGHT VIOLATIONS DEPENDING ON YOUR COUNTRY´S LAWS. WE DO NOT TAKE ANY RESPONSIBILITIES.

## Ability to Accept Terms of Service
By using Popcorn Time or accessing this site you affirm that you are either more than 18 years of age, or an emancipated minor, or possess legal parental or guardian consent, and are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations, and warranties set forth in these Terms of Service, and to abide by and comply with these Terms of Service. In any case, you affirm that you are over the age of 13, as the Service is not intended for children under 13. If you are under 13 years of age, then please do not use the Service. There are lots of other great web sites for you. Talk to your parents about what sites are appropriate for you.
`}
                </Markdown>
              </View>
            </ScrollView>

            <View style={styles.actions}>
              <Button
                style={styles.action}
                component={TouchableNativeFeedback}
                onPress={this.handleLeave}>
                {i18n.t('Leave')}
              </Button>

              <Button
                style={styles.action}
                variant={'primary'}
                component={TouchableNativeFeedback}
                onPress={this.handleAccept}>
                {i18n.t('I Accept')}
              </Button>
            </View>

          </Animatable.View>
        )}
      </React.Fragment>
    )
  }
}
