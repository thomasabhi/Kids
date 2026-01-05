import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Mascot from '../components/tactile/Mascot';
import FloatingStars from '../components/FloatingStars';
import { Sparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  
  const mascotOpacity = useRef(new Animated.Value(0)).current;
  const mascotScale = useRef(new Animated.Value(0.7)).current;
  const mascotTranslateY = useRef(new Animated.Value(30)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Entrance Animation (Starts immediately)
    Animated.parallel([
      Animated.timing(mascotOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(mascotScale, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }),
      Animated.timing(mascotTranslateY, { toValue: 0, duration: 700, useNativeDriver: true }),
      Animated.timing(textOpacity, { toValue: 1, duration: 800, delay: 400, useNativeDriver: true }),
    ]).start();

    // 2. Navigation Timer (Triggers after 2.5 seconds)
    const timer = setTimeout(() => {
      exitAndNavigate();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const exitAndNavigate = () => {
    // "Blast Off" Exit Effect before screen swap
    Animated.parallel([
      Animated.timing(containerOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(mascotScale, { toValue: 4, duration: 500, useNativeDriver: true }),
    ]).start(() => {
      // Direct navigation to 'Home' as defined in AppNavigator
      navigation.replace('Home');
    });
  };

  return (
    <TouchableWithoutFeedback onPress={exitAndNavigate}>
      <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
        <FloatingStars />
        
        <Animated.View style={{ 
          opacity: mascotOpacity, 
          transform: [
            { scale: mascotScale },
            { translateY: mascotTranslateY }
          ] 
        }}>
          <Mascot size="xl" animate="bounce" />
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
          <Text style={styles.title}>Modern Kids Learning</Text>
          <View style={styles.loadingRow}>
            <Sparkles size={18} color="#C7B8FF" />
            <Text style={styles.subtitle}>ALARIC I...</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1026',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    bottom: height * 0.15,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(199, 184, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    color: '#C7B8FF',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    opacity: 0.7,
  }
});