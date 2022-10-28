'use strict';
import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text, NavigatorIOS} from 'react-native';
import SearchPage from './SearchPage';
import JPK from './PermissionsFile';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View>
      <Text> HELLO! </Text>
      <SearchPage>
      </SearchPage>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
