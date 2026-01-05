import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Platform,
  FlatList,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  BounceIn,
} from 'react-native-reanimated';
import Tts from 'react-native-tts';
import { Palette, Sparkles, Trophy } from 'lucide-react-native';

const COLOR_DATA = [
  { id: '1', name: 'Red', hex: '#FF5E5E' },
  { id: '2', name: 'Blue', hex: '#4facfe' },
  { id: '3', name: 'Green', hex: '#48BB78' },
  { id: '4', name: 'Yellow', hex: '#FAD02E' },
  { id: '5', name: 'Purple', hex: '#A18CD1' },
  { id: '6', name: 'Orange', hex: '#F6AD55' },
  { id: '7', name: 'Pink', hex: '#F687B3' },
  { id: '8', name: 'White', hex: '#FFFFFF' },
  { id: '9', name: 'Cyan', hex: '#22D3EE' },
  { id: '10', name: 'Lime', hex: '#A3E635' },
  { id: '11', name: 'Teal', hex: '#14B8A6' },
  { id: '12', name: 'Magenta', hex: '#D946EF' },
  { id: '13', name: 'Indigo', hex: '#6366F1' },
  { id: '14', name: 'Brown', hex: '#A0522D' },
  { id: '15', name: 'Gray', hex: '#9CA3AF' },
  { id: '16', name: 'Black', hex: '#000000' },
];

const getContrastColor = (hex: string) => {
  const c = hex.substring(1);
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 180 ? '#1E293B' : '#FFF';
};

const ColorCard = ({ item, index, numColumns, onTap, disabled }: any) => {
  const { width } = useWindowDimensions();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const spacing = 16;
  const itemWidth = (width - spacing * (numColumns + 1)) / numColumns;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handlePress = () => {
    if (disabled) return;
    if (Platform.OS === 'android') Vibration.vibrate(15);
    scale.value = withSequence(withSpring(1.1), withSpring(1));
    Tts.stop();
    Tts.speak(item.name);
    onTap(item);
  };

  return (
    <Animated.View
      entering={BounceIn.delay(index * 50)}
      style={[styles.cardWrapper, { width: itemWidth }, animatedStyle]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => {
          if (disabled) return;
          scale.value = withSpring(0.92);
          translateY.value = withSpring(6);
        }}
        onPressOut={() => {
          if (disabled) return;
          scale.value = withSpring(1);
          translateY.value = withSpring(0);
        }}
        onPress={handlePress}
        style={[
          styles.cardMain,
          { backgroundColor: item.hex, opacity: disabled ? 0.6 : 1 },
        ]}
      >
        <Text style={[styles.colorName, { color: getContrastColor(item.hex) }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
      <View style={[styles.cardDepth, { backgroundColor: item.hex, opacity: 0.6 }]} />
    </Animated.View>
  );
};

export default function ColorMatchingGame() {
  const { width, height } = useWindowDimensions();
  const numColumns = width > height ? (width > 768 ? 4 : 3) : 2;

  // FIXED: Converted bgTranslate to useSharedValue for Reanimated compatibility
  const bgTranslate = useSharedValue(0);
  const bgColor = useSharedValue('#1E293B');
  
  const [targetColor, setTargetColor] = useState<any>(null);
  const [sparkles, setSparkles] = useState<any[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [shuffledColors, setShuffledColors] = useState(COLOR_DATA);
  const [score, setScore] = useState(0);

  useEffect(() => {
    Tts.setDefaultRate(0.5);
    pickNextTarget();

    // FIXED: Loop background translation using Reanimated logic
    bgTranslate.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 4000 }),
        withTiming(0, { duration: 4000 })
      ),
      -1,
      false
    );
  }, []);

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
    transform: [{ translateY: bgTranslate.value }],
  }));

  const pickNextTarget = () => {
    const next = COLOR_DATA[Math.floor(Math.random() * COLOR_DATA.length)];
    setTargetColor(next);
    setShuffledColors((prev) => [...prev].sort(() => Math.random() - 0.5));
    bgColor.value = withTiming(next.hex, { duration: 500 });
    Tts.stop();
    Tts.speak(`Find the color ${next.name}`);
  };

  const handleColorTap = (item: any) => {
    if (item.id === targetColor.id) {
      setScore(s => s + 1);
      setDisabled(true);
      triggerSparkle();
      Tts.speak("Great job!");
      setTimeout(() => {
        pickNextTarget();
        setDisabled(false);
      }, 800);
    } else {
      if (Platform.OS === 'android') Vibration.vibrate(100);
      Tts.speak(`That is ${item.name}. Try to find ${targetColor.name}`);
    }
  };

  const triggerSparkle = () => {
    const newSparkle = {
      id: Date.now(),
      color: '#FFD700',
      top: Math.random() * (height * 0.5),
      left: Math.random() * (width - 100),
      size: Math.random() * 40 + 30,
    };
    setSparkles((prev) => [...prev, newSparkle]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* FIXED: Using Animated.View from Reanimated to match bgAnimatedStyle */}
      <Animated.View style={[StyleSheet.absoluteFillObject, bgAnimatedStyle]} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Score Bar */}
        <View style={styles.scoreBar}>
          <Trophy color="#FFD700" size={24} />
          <Text style={styles.scoreText}>{score}</Text>
        </View>

        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {sparkles.map((s) => (
            <Sparkles
              key={s.id}
              size={s.size}
              color={s.color}
              style={{ position: 'absolute', top: s.top, left: s.left }}
              opacity={1}
            />
          ))}
        </View>

        <View style={styles.header}>
          <Palette color="#FFF" size={32} style={{ marginBottom: 10 }} />
          <Text style={styles.headerTitle}>Match This Color:</Text>
          {targetColor && (
            <Text style={[styles.targetColorText, { color: getContrastColor(targetColor.hex) }]}>
              {targetColor.name}
            </Text>
          )}
        </View>

        <FlatList
          data={shuffledColors}
          key={numColumns}
          numColumns={numColumns}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ColorCard
              item={item}
              index={index}
              numColumns={numColumns}
              onTap={handleColorTap}
              disabled={disabled}
            />
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scoreBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    marginLeft: 8,
  },
  header: { paddingVertical: 20, alignItems: 'center' },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  targetColorText: {
    fontSize: 40,
    fontWeight: '900',
    marginTop: 5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  cardWrapper: {
    height: 140,
    marginVertical: 10,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  cardMain: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cardDepth: {
    position: 'absolute',
    bottom: -8,
    width: '100%',
    height: '100%',
    borderRadius: 30,
    zIndex: 1,
  },
  colorName: {
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});