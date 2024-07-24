import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { questions } from '../data/questions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const screenWidth = Dimensions.get('window').width;

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

interface Question {
  question: string;
  answers: string[];
  correct: number;
}

interface ShuffledQuestion extends Question {
  shuffledAnswers: string[];
  shuffledCorrectIndex: number;
}

const Quiz: React.FC<Props> = ({ navigation, route }) => {
  const { playerName } = route.params;
  const [quiz, setQuiz] = useState<ShuffledQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (showScore && score > 0) {
      navigation.navigate('Leaderboard', { playerName, score });
    } else if (showScore && score === 0) {
      navigation.navigate('EnterName');
    }
  }, [showScore, navigation, playerName, score]);

  const loadQuestions = () => {
    if (questions && questions.length > 0) {
      const shuffledQuestions = questions.map((q) => {
        const answers = [...q.answers];
        const correctAnswer = answers[q.correct];
        const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
        const shuffledCorrectIndex = shuffledAnswers.indexOf(correctAnswer);
        return { ...q, shuffledAnswers, shuffledCorrectIndex };
      }).sort(() => Math.random() - 0.5);
      setQuiz(shuffledQuestions);
    }
  };

  const handleAnswerPress = (index: number) => {
    if (!isAnswered) {
      setIsAnswered(true);
      setSelectedAnswer(index);
      if (quiz[currentQuestionIndex].shuffledCorrectIndex === index) {
        setScore(score + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < quiz.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      setShowScore(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setIsAnswered(false);
    setSelectedAnswer(null);
    loadQuestions();
  };

  if (!quiz.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>Question {currentQuestionIndex + 1}: {quiz[currentQuestionIndex].question}</Text>
      {quiz[currentQuestionIndex].shuffledAnswers.map((answer, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.answerButton,
            isAnswered && index === quiz[currentQuestionIndex].shuffledCorrectIndex
              ? styles.correctAnswer
              : isAnswered && index === selectedAnswer
              ? styles.incorrectAnswer
              : styles.defaultAnswer,
          ]}
          onPress={() => handleAnswerPress(index)}
          disabled={isAnswered}
        >
          <Text style={[styles.answerText, isAnswered && (index === quiz[currentQuestionIndex].shuffledCorrectIndex || index === selectedAnswer) ? styles.answerTextWhite : styles.answerTextDark]}>{answer}</Text>
        </TouchableOpacity>
      ))}
      {isAnswered && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleNextQuestion}>
            <Text style={styles.buttonText}>Next Question</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.restartButton]} onPress={handleRestart}>
            <Text style={styles.buttonText}>Restart</Text>
          </TouchableOpacity>
        </View>
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
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  answerButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: screenWidth * 0.8,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  defaultAnswer: {
    backgroundColor: '#ffffff',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  correctAnswer: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  incorrectAnswer: {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },
  answerText: {
    fontSize: 18,
  },
  answerTextWhite: {
    color: '#fff',
  },
  answerTextDark: {
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restartButton: {
    backgroundColor: '#6c757d',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  correctText: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default Quiz;