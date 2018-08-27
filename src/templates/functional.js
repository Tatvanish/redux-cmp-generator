import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
//styles
import styles from './COMPONENT_NAMEViewStyles';

const COMPONENT_NAMEView = () => {
  return (
    <View styles={styles.container}>
    </View>
  );
};

export default connect()(COMPONENT_NAMEView);