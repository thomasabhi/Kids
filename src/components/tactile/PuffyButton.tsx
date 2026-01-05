import React from 'react';
import { StyleSheet, Pressable, ViewStyle, Platform, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { COLORS } from '../../assets/constants/color';

interface PuffyButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  color?: string; 
}

export const PuffyButton = ({ onPress, children, style, color }: PuffyButtonProps) => {
  const isPressed = useSharedValue(0);

  // Set base color from prop or style
  const baseColor = color || (style?.backgroundColor as string) || '#5C6BC0';

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isPressed.value === 1 ? 0.94 : 1, { damping: 12, stiffness: 200 }) },
      ],
      backgroundColor: interpolateColor(
        isPressed.value, 
        [0, 1], 
        [baseColor, '#4A55A2'] // Darks slightly when pressed
      ),
    };
  });

  return (
    <Pressable
      onPressIn={() => (isPressed.value = 1)}
      onPressOut={() => (isPressed.value = 0)}
      onPress={onPress}
      style={styles.pressable}
    >
      <Animated.View style={[styles.shadowWrapper]}>
        <Animated.View style={[styles.button, style, animatedStyle]}>
          {children}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: { marginVertical: 10 },
  shadowWrapper: {
    borderRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});