import React, { useRef, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, Dimensions, PanResponder, SafeAreaView,
  TouchableOpacity, Platform, StatusBar, LayoutChangeEvent, Alert, PermissionsAndroid
} from 'react-native';
import Svg, { Path, G, Text as SvgText, Circle } from 'react-native-svg';
import Animated, { BounceIn } from 'react-native-reanimated';
import Tts from 'react-native-tts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ViewShot, { captureRef } from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BIRD_COLORS = ['#FFD93D', '#FF8C42', '#4BCBFF', '#62D261', '#A55EEA'];

const normalize = (size: number, width: number = SCREEN_WIDTH) => 
  Math.round(size * (width / 375));

type Point = { x: number; y: number; color: string };

export default function BirdsScreen() {
  const viewShotRef = useRef<ViewShot>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [brushColor, setBrushColor] = useState('#FFD93D');
  const [celebrate, setCelebrate] = useState(false);
  const [stars, setStars] = useState(0);

  const [layout, setLayout] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    isLandscape: Dimensions.get('window').width > Dimensions.get('window').height,
  });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height, isLandscape: width > height });
  };

  const geometry = useMemo(() => {
    const canvasHeight = layout.isLandscape ? layout.height * 0.55 : layout.height * 0.5;
    return { canvasHeight, center: { x: layout.width / 2, y: canvasHeight / 2 } };
  }, [layout]);

  // --- SAVE LOGIC ---
  const saveDrawing = async () => {
    if (Platform.OS === 'android') {
        const permission = Number(Platform.Version) >= 33 
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES 
            : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        const status = await PermissionsAndroid.request(permission);
        if (status !== 'granted') return;
    }
    try {
      const uri = await captureRef(viewShotRef, { format: "png", quality: 0.9 });
      await CameraRoll.saveAsset(uri, { type: 'photo' });
      Alert.alert("Tweet Tweet! 🐦", "Your bird is saved in your gallery!");
    } catch (e) {
      Alert.alert("Oops!", "Rebuild the app to enable saving.");
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setPoints(prev => [...prev, { x: locationX, y: locationY, color: brushColor }]);
      },
      onPanResponderRelease: () => {
        if (points.length > 30) {
          setCelebrate(true);
          setStars(s => s + 1);
          Tts.speak("What a beautiful bird!");
          setTimeout(() => setCelebrate(false), 2000);
        }
      }
    })
  ).current;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} onLayout={onLayout}>
        <View style={[styles.mainWrapper, layout.isLandscape && styles.landscapeWrapper]}>
          
          {/* HEADER */}
          <View style={[styles.topSection, layout.isLandscape && styles.landscapeTop]}>
            <Text style={styles.title}>Bird Painter 🐤</Text>
            <View style={styles.stats}>
                <Text style={styles.starText}>⭐ {stars}</Text>
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={saveDrawing}>
              <Text style={styles.saveBtnText}>📸 SAVE BIRD</Text>
            </TouchableOpacity>
          </View>

          {/* CANVAS */}
          <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.9 }} style={{ flex: layout.isLandscape ? 1.5 : 0 }}>
            <View style={[styles.drawingBoard, { height: geometry.canvasHeight }]} {...panResponder.panHandlers}>
              <Svg height={geometry.canvasHeight} width={layout.width}>
                {/* Bird Guide Silhouette */}
                <G opacity="0.1" transform={`translate(${geometry.center.x - 50}, ${geometry.center.y - 50}) scale(2)`}>
                    <Path d="M30,20 C10,20 5,40 5,60 C5,80 15,90 30,90 C45,90 55,80 55,60 C55,40 50,20 30,20 Z" fill="#000" />
                    <Circle cx="45" cy="40" r="15" fill="#000" /> 
                    <Path d="M55,35 L65,40 L55,45 Z" fill="#000" />
                </G>

                {/* The Drawing */}
                {points.map((p, i) => i > 0 && (
                  <Path
                    key={i}
                    d={`M ${points[i-1].x} ${points[i-1].y} L ${p.x} ${p.y}`}
                    stroke={p.color}
                    strokeWidth={15}
                    strokeLinecap="round"
                  />
                ))}
              </Svg>
              {celebrate && (
                <Animated.View entering={BounceIn} style={styles.overlay}>
                  <Text style={styles.overlayText}>🐦 AMAZING! 🌈</Text>
                </Animated.View>
              )}
            </View>
          </ViewShot>

          {/* MENU */}
          <View style={[styles.bottomMenu, layout.isLandscape && styles.landscapeBottom]}>
            <Text style={styles.label}>Pick a Feather Color:</Text>
            <View style={styles.colorRow}>
              {BIRD_COLORS.map(c => (
                <TouchableOpacity 
                    key={c} 
                    style={[styles.bubble, { backgroundColor: c, borderWidth: brushColor === c ? 3 : 0 }]} 
                    onPress={() => setBrushColor(c)} 
                />
              ))}
            </View>
            <TouchableOpacity style={styles.clearBtn} onPress={() => setPoints([])}>
              <Text style={styles.clearText}>START OVER</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBEB' },
  mainWrapper: { flex: 1 },
  landscapeWrapper: { flexDirection: 'row' },
  topSection: { alignItems: 'center', padding: 15 },
  landscapeTop: { width: '25%', justifyContent: 'center' },
  title: { fontSize: normalize(26), fontWeight: '900', color: '#92400E' },
  stats: { marginVertical: 5 },
  starText: { fontSize: 20, fontWeight: 'bold', color: '#D97706' },
  saveBtn: { backgroundColor: '#059669', padding: 10, borderRadius: 12, marginTop: 10 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold' },
  drawingBoard: { backgroundColor: '#FEF3C7', width: '100%' },
  bottomMenu: { padding: 20, alignItems: 'center' },
  landscapeBottom: { width: '25%', justifyContent: 'center' },
  label: { fontWeight: '700', color: '#B45309', marginBottom: 10 },
  colorRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  bubble: { width: 40, height: 40, borderRadius: 20, borderColor: '#92400E' },
  clearBtn: { backgroundColor: '#EF4444', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 15 },
  clearText: { color: '#FFF', fontWeight: '900' },
  overlay: { position: 'absolute', alignSelf: 'center', top: '40%', backgroundColor: 'white', padding: 20, borderRadius: 20, elevation: 5 },
  overlayText: { fontSize: 24, fontWeight: '900', color: '#D97706' }
});