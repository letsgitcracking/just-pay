import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
function SendMoney() {
    return fetch('http://192.168.0.29:3001/send')
      .then().catch(function (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        throw error;
      });
  }
  return (
    <View style={styles.container}>
      <Text>Pay 980 XRP</Text>
      <Button
        onPress={SendMoney}
        title="Pay Elliot!"
        color="#0E7490"
        accessibilityLabel="Pay Now"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
