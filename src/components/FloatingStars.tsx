import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const FloatingStars = () => {
  const stars = Array.from({ length: 6 });

  return (
    <>
      {stars.map((_, i) => {
        const anim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
          Animated.loop(
            Animated.sequence([
              Animated.timing(anim, { toValue: -20, duration: 3000 + i * 500, useNativeDriver: true }),
              Animated.timing(anim, { toValue: 0, duration: 3000 + i * 500, useNativeDriver: true }),
            ])
          ).start();
        }, []);

        return (
          <Animated.View
            key={i}
            style={[
              styles.star,
              {
                top: Math.random() * height,
                left: Math.random() * width,
                transform: [{ translateY: anim }],
              },
            ]}
          >
            <Star size={18} color="#C7B8FF" />
          </Animated.View>
        );
      })}
    </>
  );
};

export default FloatingStars;

const styles = StyleSheet.create({ star: { position: 'absolute', opacity: 0.7 } });
