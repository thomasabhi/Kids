import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  ActivityIndicator,
  Vibration,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  BounceIn,
  FadeInDown,
} from 'react-native-reanimated';
import Tts from 'react-native-tts';
import { Volume2, Star, Sparkles, Heart, Home } from 'lucide-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useContentStore, ContentItem } from '../store/useContentStore';

const COLORS = ['#FFB347', '#77DD77', '#4facfe', '#FF5E5E', '#A18CD1', '#FAD02E'];
const CONFETTI_COUNT = 80;

// ---------- Pop Animation ----------
const PopEffect = ({ color }: { color: string }) => (
  <Animated.View entering={FadeInDown.duration(600)} style={StyleSheet.absoluteFill}>
    <Star size={24} color={color} style={{ position: 'absolute', top: -20, left: '20%' }} />
    <Heart size={20} color={color} style={{ position: 'absolute', top: -30, right: '20%' }} />
  </Animated.View>
);

// ---------- Alphabet Card ----------
const LetterCard = ({ item, index, numColumns, onPlay }: any) => {
  const { completedCount } = useContentStore();
  const { width } = useWindowDimensions();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const [showPop, setShowPop] = useState(false);

  const spacing = 16;
  const itemWidth = (width - spacing * (numColumns + 1)) / numColumns;
  const cardColor = COLORS[index % COLORS.length];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handlePress = () => {
    if (completedCount >= 10) return;
    scale.value = withSequence(withSpring(1.15), withSpring(1));
    setShowPop(true);
    setTimeout(() => setShowPop(false), 800);
    onPlay(item);
  };

  return (
    <Animated.View
      entering={BounceIn.delay(index * 50).springify().damping(12)}
      style={[styles.cardWrapper, { width: itemWidth }, animatedStyle]}
    >
      {showPop && <PopEffect color={cardColor} />}
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => {
          if (completedCount < 10) {
            scale.value = withSpring(0.9);
            translateY.value = withSpring(6);
          }
        }}
        onPressOut={() => translateY.value = withSpring(0)}
        onPress={handlePress}
        style={[styles.cardMain, { backgroundColor: cardColor }]}
      >
        <View style={styles.iconOverlay}>
          <Volume2 size={24} color="white" opacity={0.7} />
        </View>
        <Text style={styles.letterText}>{item.title}</Text>
        <View style={styles.labelPill}>
          <Text style={styles.emojiText}>{item.emoji || item.imageUrl}</Text>
          <Text style={styles.wordText}>{item.question}</Text>
        </View>
      </TouchableOpacity>
      <View style={[styles.cardDepth, { backgroundColor: cardColor, opacity: 0.6 }]} />
    </Animated.View>
  );
};

// ---------- Main Alphabet Screen ----------
export default function AlphabetScreen() {
  const { width, height } = useWindowDimensions();
  const { items, loading, fetchByType, fetchMore, completedCount, trackAnswer } = useContentStore();
  const [showConfetti, setShowConfetti] = useState(false);

  const isLandscape = width > height;
  const isTablet = width > 768;
  const numColumns = isTablet ? (isLandscape ? 4 : 3) : 2;

  useEffect(() => {
    fetchByType('letter', true);
    Tts.setDefaultRate(0.45);
    Tts.setDefaultPitch(1.1);
  }, []);

  const handlePlay = useCallback(
    (item: ContentItem) => {
      if (completedCount >= 10) return;

      if (Platform.OS === 'android') Vibration.vibrate(20);

      Tts.stop();
      Tts.speak(`${item.title}... for ... ${item.question}`);
      // trackAnswer();

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    },
    [completedCount]
  );

  const handleEndReached = () => {
    if (!loading && completedCount < 10) fetchMore('letter');
  };

  if (loading && items.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFB347" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {showConfetti && <ConfettiCannon count={CONFETTI_COUNT} origin={{ x: width / 2, y: 0 }} fadeOut />}

      {/* Background Sparkles */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Sparkles color="white" size={40} style={[styles.bgIcon, { top: '15%', left: '10%' }]} opacity={0.1} />
        <Star color="white" size={50} style={[styles.bgIcon, { bottom: '20%', right: '15%' }]} opacity={0.1} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ABC Garden</Text>
        {completedCount >= 10 && (
          <Text style={{ color: '#FFB347', fontWeight: '900', marginTop: 8 }}>Daily limit reached!</Text>
        )}
      </View>

      {/* Alphabet Cards List */}
      <FlatList
        data={items}
        key={numColumns}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        scrollEnabled={completedCount < 10}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator color="#FFB347" size="small" style={{ margin: 16 }} /> : null
        }
        renderItem={({ item, index }) => (
          <LetterCard item={item} index={index} numColumns={numColumns} onPlay={handlePlay} />
        )}
      />

      {/* Floating Home Button */}
      <TouchableOpacity style={styles.floatingHome}>
        <Home size={isTablet ? 36 : 28} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1026' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B1026' },
  header: { paddingVertical: 20, alignItems: 'center' },
  headerTitle: { fontSize: 38, fontWeight: '900', color: '#FFF', textShadowColor: '#000', textShadowRadius: 10 },
  listContent: { paddingHorizontal: 16, paddingBottom: 60 },
  cardWrapper: { height: 190, marginVertical: 15, marginHorizontal: 5, alignItems: 'center' },
  cardMain: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  cardDepth: { position: 'absolute', bottom: -10, width: '100%', height: '100%', borderRadius: 40, zIndex: 1 },
  iconOverlay: { position: 'absolute', top: 15, right: 15 },
  letterText: {
    fontSize: 74,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 3,
  },
  labelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 25,
    marginTop: 5,
  },
  emojiText: { fontSize: 22, marginRight: 8 },
  wordText: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  bgIcon: { position: 'absolute' },
  floatingHome: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#8B5CF6',
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
  },
});
