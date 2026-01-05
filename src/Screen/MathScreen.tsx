import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  ScrollView,
  Platform,
  Vibration
} from 'react-native';
import Tts from 'react-native-tts';
import { useContentStore } from '../store/useContentStore';
import { RefreshCw, Volume2, CheckCircle, XCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const MathScreen = () => {
  const { items, loading, fetchByType, correctCount, wrongCount, trackAnswer } = useContentStore();
  const [answeredItem, setAnsweredItem] = useState<string | null>(null);

  const loadMath = () => {
    fetchByType('math', true);
    setAnsweredItem(null);
  };

  useEffect(() => {
    Tts.setDefaultRate(0.5);
    loadMath();
  }, []);

  const handleAnswer = (userChoice: string, item: any) => {
    const isCorrect = userChoice === item.correctAnswer;
    setAnsweredItem(item._id);

    if (isCorrect) {
      Tts.speak("Great job!");
      if (Platform.OS === 'android') Vibration.vibrate(30);
    } else {
      Tts.speak("Try again!");
      if (Platform.OS === 'android') Vibration.vibrate([0, 50, 20, 50]);
    }

    trackAnswer(isCorrect);
  };

  if (loading && items.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C4B5FD" />
      </View>
    );
  }

  return (
    <ImageBackground source={require('../assets/cosmic-bg.png')} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        {/* STATS */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <CheckCircle size={20} color="#4ADE80" />
            <Text style={styles.statText}>{correctCount}</Text>
          </View>
          <Text style={styles.headerTitle}>Math Fun</Text>
          <View style={styles.statItem}>
            <XCircle size={20} color="#F87171" />
            <Text style={styles.statText}>{wrongCount}</Text>
          </View>
        </View>

        {/* MATH CARDS */}
        <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
          {items.map((item, index) => (
            <View
              key={item._id || index}
              style={[styles.mathCard, { borderColor: ['#A78BFA', '#60A5FA', '#34D399', '#FB923C'][index % 4] }]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.mathText}>{item.question}</Text>
                <TouchableOpacity onPress={() => Tts.speak(item.question)}>
                  <Volume2 size={22} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsGrid}>
                {item.options?.map((opt, i) => {
                  const isCorrect = answeredItem === item._id && opt === item.correctAnswer;
                  const isWrong = answeredItem === item._id && opt !== item.correctAnswer && opt === opt;

                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.optionBox,
                        isCorrect && { backgroundColor: '#4ADE80' },
                        isWrong && { backgroundColor: '#F87171' }
                      ]}
                      onPress={() => handleAnswer(opt, item)}
                      disabled={answeredItem === item._id}
                    >
                      <Text style={styles.optionText}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* REFRESH BUTTON */}
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => loadMath()}
        >
          <RefreshCw size={20} color="#FFF" />
          <Text style={styles.refreshBtnText}>New Problems</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B1026' },
  statsBar: { flexDirection: 'row', width: '90%', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  statItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statText: { color: '#FFF', fontWeight: 'bold', marginLeft: 5, fontSize: 18 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 120 },
  mathCard: { width: width * 0.44, backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: 25, padding: 15, margin: 8, borderWidth: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  mathText: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  optionBox: { width: '48%', backgroundColor: 'rgba(51, 65, 85, 0.8)', paddingVertical: 10, borderRadius: 12, alignItems: 'center', marginBottom: 8 },
  optionText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  refreshBtn: { position: 'absolute', bottom: 30, backgroundColor: '#8B5CF6', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 20 },
  refreshBtnText: { color: '#FFF', fontWeight: '900', marginLeft: 10, fontSize: 18 }
});

export default MathScreen;
