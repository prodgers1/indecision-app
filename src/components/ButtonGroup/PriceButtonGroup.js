import React, { Component } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';

const PriceButtonGroup = ({ values, setValues }) => {
  // console.log(values);

  const toggleValue = (value) => {
    if (values.indexOf(value) === -1) {
      let newValues = [...values, value];
      setValues(newValues);
    } else {
      setValues(
        values.filter((v) => {
          return v != value;
        })
      );
    }
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map((i) => {
        return (
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, { backgroundColor: values.indexOf(i) != -1 ? '#00FF00' : '#fff' }]}
              onPress={() => toggleValue(i)}
            >
              <Text style={styles.buttonText}>{'$'.repeat(i)}</Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  buttonContainer: {
    width: 75,
    borderWidth: 2,
    borderRadius: 5,
    margin: 4,
  },
  button: {
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold',
  },
});

export default PriceButtonGroup;
