import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
//styles
import styles from './COMPONENT_NAMEViewStyles';

class COMPONENT_NAMEView extends PureComponent {
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

export default connect()(COMPONENT_NAMEView);