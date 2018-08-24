import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import styles from './COMPONENT_NAMEViewStyles';
class COMPONENT_NAME extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text> COMPONENT_NAME </Text>
      </View>
    );
  }
}

export default connect()(COMPONENT_NAME);