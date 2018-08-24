import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import styles from './COMPONENT_NAMEViewStyles';

const COMPONENT_NAME = () => {
  return (
    <View styles={styles.container}>
    </View>
  );
};

export default connect()(COMPONENT_NAME);