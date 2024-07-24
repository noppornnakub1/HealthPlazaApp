// components/Leaderboard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Leaderboard = () => {
  const leaderboard = [
    { name: "Alice", score: 90 },
    { name: "Bob", score: 85 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      {leaderboard.map((entry, index) => (
        <Text key={index} style={styles.entry}>
          {entry.name}: {entry.score}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  entry: {
    fontSize: 18,
    marginBottom: 5,
  },
});

export default Leaderboard;
