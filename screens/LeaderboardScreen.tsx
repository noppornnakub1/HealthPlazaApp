import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Leaderboard'>;

interface LeaderboardEntry {
  playerName: string;
  score: number;
}

const LeaderboardScreen: React.FC<Props> = ({ route, navigation }) => {
  const { playerName, score } = route.params;
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const storedLeaderboard = await AsyncStorage.getItem('leaderboard');
        if (storedLeaderboard) {
          const parsedLeaderboard: LeaderboardEntry[] = JSON.parse(storedLeaderboard);
          setLeaderboard(parsedLeaderboard);
          console.log('Loaded leaderboard:', parsedLeaderboard);
        }
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setInitialized(true);
      }
    };

    loadLeaderboard();
  }, []);

  useEffect(() => {
    const saveScore = async () => {
      if (initialized && playerName && score > 0) {
        const newEntry: LeaderboardEntry = { playerName, score };
        const updatedLeaderboard = [...leaderboard, newEntry]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // Limit to top 10 scores
        try {
          await AsyncStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
          setLeaderboard(updatedLeaderboard);
          console.log('Saved leaderboard:', updatedLeaderboard);
        } catch (error) {
          console.error('Failed to save leaderboard:', error);
        }
      }
    };

    if (initialized) {
      saveScore();
    }
  }, [initialized]);

  const clearLeaderboard = async () => {
    try {
      await AsyncStorage.removeItem('leaderboard');
      setLeaderboard([]);
      navigation.navigate('Home');
      console.log('Leaderboard cleared');
    } catch (error) {
      console.error('Failed to clear leaderboard:', error);
    }
  };

  const handleNextPlayer = () => {
    navigation.navigate('EnterName');
    console.log('Navigated to EnterName');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <ScrollView style={styles.leaderboardContainer}>
        {leaderboard.length === 0 ? (
          <Text>No scores yet</Text>
        ) : (
          leaderboard.map((entry, index) => (
            <View key={index} style={styles.entryContainer}>
              <Text style={styles.rankText}>#{index + 1}</Text>
              <Text style={styles.entryText}>{entry.playerName}</Text>
              <Text style={styles.scoreText}>{entry.score}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity style={styles.nextPlayerButton} onPress={handleNextPlayer}>
        <Text style={styles.buttonText}>Next Player</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.clearButton} onPress={clearLeaderboard}>
        <Text style={styles.buttonText}>Clear Leaderboard</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  leaderboardContainer: {
    width: '100%',
    marginBottom: 20,
  },
  entryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  entryText: {
    fontSize: 18,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextPlayerButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007bff',
    marginVertical: 10,
    alignItems: 'center',
    width: '90%',
  },
  clearButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#dc3545',
    marginVertical: 10,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LeaderboardScreen;