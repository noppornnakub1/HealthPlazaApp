import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { longestCommonPrefix } from '../src/longestCommonPrefix';

const TestScreen = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleTest = () => {
    const strs = input.split(',').map(str => str.trim());
    setResult(longestCommonPrefix(strs));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter strings separated by commas:</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="e.g. flower,flow,flight"
      />
      <Button title="Test" onPress={handleTest} />
      {result !== '' && (
        <Text style={styles.result}>Longest Common Prefix: {result}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    width: '80%',
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});

export default TestScreen;