import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from './Home'
import ItemScreen from './Item'
import PlayerScreen from './Player'
import ModeScreen from './Mode'

const Stack = createStackNavigator()

export default () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false
    }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Item" component={ItemScreen} />
    <Stack.Screen name="Player" component={PlayerScreen} />

    <Stack.Screen name="Movies">
      {(props) => <ModeScreen mode={'movies'} {...props} />}
    </Stack.Screen>

    <Stack.Screen name="Shows">
      {(props) => <ModeScreen mode={'shows'} {...props} />}
    </Stack.Screen>

    <Stack.Screen name="MyList">
      {(props) => <ModeScreen mode={'bookmarks'} {...props} />}
    </Stack.Screen>
  </Stack.Navigator>
)
