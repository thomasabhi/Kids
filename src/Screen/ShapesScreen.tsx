import React, { useRef, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, Dimensions, PanResponder, SafeAreaView,
  TouchableOpacity, Platform, LayoutChangeEvent, Alert, PermissionsAndroid
} from 'react-native';
import Svg, { Path, G, Text as SvgText, Rect, Circle } from 'react-native-svg';
import Animated, { BounceIn } from 'react-native-reanimated';
import Tts from 'react-native-tts';
import Sound from 'react-native-sound';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ViewShot, { captureRef } from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BRUSH_COLORS = ['#FF4B4B', '#4BCBFF', '#62D261', '#FFD93D', '#A55EEA', '#FF6EC7', '#FF9F1C'];
const BRUSH_SIZES = [
  { label: 'Small', value: 8 },
  { label: 'Medium', value: 15 },
  { label: 'Large', value: 25 },
];

type Stroke = { x: number; y: number; color: string; isEraser: boolean; width: number };
type Sparkle = { x: number; y: number; id: number; color: string; size: number };

export default function ShapesScreen() {
  const viewShotRef = useRef<ViewShot>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [brushColor, setBrushColor] = useState('#FF4B4B');
  const [brushSize, setBrushSize] = useState(15); // default medium
  const [isRainbow, setIsRainbow] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const [layout, setLayout] = useState({
    width: SCREEN_WIDTH,
    height: Dimensions.get('window').height,
    isLandscape: SCREEN_WIDTH > Dimensions.get('window').height,
  });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height, isLandscape: width > height });
  };

  const geometry = useMemo(() => {
    const canvasHeight = layout.height * 0.55;
    return { canvasHeight };
  }, [layout]);

  // --- Sound Setup ---
  const brushSound = useRef(new Sound('brush.mp3', Sound.MAIN_BUNDLE, (e) => e && console.log(e))).current;
  const eraserSound = useRef(new Sound('eraser.mp3', Sound.MAIN_BUNDLE, (e) => e && console.log(e))).current;

  const playBrushSound = () => { brushSound.stop(() => brushSound.play()); };
  const playEraserSound = () => { eraserSound.stop(() => eraserSound.play()); };

  // --- Permissions & Save ---
  const hasAndroidPermission = async () => {
    const permission = Number(Platform.Version) >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const saveDrawing = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      Alert.alert("Permission Required", "Please allow gallery access to save your art!");
      return;
    }
    try {
      const uri = await captureRef(viewShotRef, { format: "png", quality: 0.9 });
      await CameraRoll.save(uri, { type: 'photo' });
      Alert.alert("Saved! 🌟", "Your masterpiece is in your gallery!");
    } catch (e) {
      Alert.alert("Error", "Could not save. Try rebuilding the app.");
    }
  };

  // --- Magic Eraser ---
  const ERASER_RADIUS = 40;
  const handleEraserMove = (x: number, y: number) => {
    playEraserSound();
    setStrokes(prev => prev.filter(p => Math.hypot(p.x - x, p.y - y) > ERASER_RADIUS));
    createSparkle(x, y, 5);
  };

  // --- Sparkle effect ---
  const createSparkle = (x: number, y: number, size: number) => {
    const id = Date.now() + Math.random(); // ensure unique key
    const color = BRUSH_COLORS[Math.floor(Math.random() * BRUSH_COLORS.length)];
    setSparkles(prev => [...prev, { x, y, id, color, size }]);
    setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== id)), 500);
  };

  // --- PanResponder ---
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;

        if (isEraser) {
          handleEraserMove(locationX, locationY);
          return;
        }

        playBrushSound();

        const currentColor = isRainbow
          ? BRUSH_COLORS[Math.floor(Math.random() * BRUSH_COLORS.length)]
          : brushColor;

        setStrokes(prev => [
          ...prev,
          { x: locationX, y: locationY, color: currentColor, isEraser: false, width: brushSize }
        ]);

        createSparkle(locationX, locationY, brushSize / 3); // sparkle scales with brush
      },
      onPanResponderRelease: () => {
        if (strokes.length > 20 && !isEraser) {
          setCelebrate(true);
          Tts.speak("Wow! Amazing!");
          setTimeout(() => setCelebrate(false), 2000);
        }
      }
    })
  ).current;

  // --- Render Paths ---
  const renderPaths = () => {
    const paths = [];
    for (let i = 1; i < strokes.length; i++) {
      const s = strokes[i];
      const prev = strokes[i - 1];
      paths.push(
        <Path
          key={i}
          d={`M ${prev.x} ${prev.y} L ${s.x} ${s.y}`}
          stroke={s.color}
          strokeWidth={s.width}
          strokeLinecap="round"
        />
      );
    }
    return paths;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} onLayout={onLayout}>
        <View style={styles.mainWrapper}>

          {/* Top Bar */}
          <View style={styles.topBar}>
            <Text style={styles.title}>🌟 Space Paint 🚀</Text>
            <TouchableOpacity style={styles.saveBtn} onPress={saveDrawing}>
              <Text style={styles.saveText}>📸 SAVE</Text>
            </TouchableOpacity>
          </View>

          {/* Current Color Indicator */}
          {!isRainbow && !isEraser &&
            <View style={[styles.currentColorIndicator, { backgroundColor: brushColor }]} />
          }

          {/* Canvas */}
          <ViewShot ref={viewShotRef} style={styles.canvasWrapper}>
            <View style={[styles.drawingBoard, { height: geometry.canvasHeight }]} {...panResponder.panHandlers}>
              <Svg height={geometry.canvasHeight} width={layout.width}>
                <Rect x={0} y={0} width={layout.width} height={geometry.canvasHeight} fill="#1e293b" />

                {/* Stars */}
                <G opacity={0.3}>
                  {[...Array(20)].map((_, i) => (
                    <SvgText key={i} x={(i * 70) % layout.width} y={(i * 50) % geometry.canvasHeight} fontSize="25">⭐</SvgText>
                  ))}
                </G>

                {/* Drawn strokes */}
                {renderPaths()}

                {/* Sparkles */}
                {sparkles.map(s => (
                  <Circle
                    key={s.id}
                    cx={s.x}
                    cy={s.y}
                    r={s.size}
                    fill={s.color}
                    opacity={0.9}
                  />
                ))}
              </Svg>
            </View>
          </ViewShot>

          {/* Bottom Tools */}
          <View style={styles.bottomMenu}>
            {/* Color Picker */}
            <View style={styles.toolRow}>
              {BRUSH_COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.bubble,
                    { backgroundColor: c },
                    brushColor === c && !isRainbow && !isEraser ? styles.activeTool : {}
                  ]}
                  onPress={() => { setBrushColor(c); setIsRainbow(false); setIsEraser(false); }}
                />
              ))}

              <TouchableOpacity
                style={[styles.toolBtn, isRainbow ? styles.activeTool : {}]}
                onPress={() => { setIsRainbow(true); setIsEraser(false); }}
              >
                <Text style={{ fontSize: 22 }}>🌈</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toolBtn, isEraser ? styles.activeTool : {}]}
                onPress={() => { setIsEraser(true); setIsRainbow(false); }}
              >
                <Text style={{ fontSize: 22 }}>🧽</Text>
              </TouchableOpacity>
            </View>

            {/* Brush Size Selector */}
            <View style={[styles.toolRow, { marginTop: 10 }]}>
              {BRUSH_SIZES.map(b => (
                <TouchableOpacity
                  key={b.label}
                  style={[
                    styles.brushBtn,
                    brushSize === b.value ? styles.activeTool : {}
                  ]}
                  onPress={() => setBrushSize(b.value)}
                >
                  <Text style={{ color: brushSize === b.value ? '#FFD700' : '#FFF', fontWeight: '700' }}>{b.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.clearBtn} onPress={() => setStrokes([])}>
              <Text style={styles.clearText}>🧹 CLEAR ALL</Text>
            </TouchableOpacity>
          </View>

          {/* Celebrate Animation */}
          {celebrate &&
            <Animated.Text entering={BounceIn.duration(800)} style={styles.celebrateText}>🎉 Awesome! 🎉</Animated.Text>
          }
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  mainWrapper: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFD700' },
  saveBtn: { backgroundColor: '#22C55E', padding: 12, borderRadius: 15 },
  saveText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  canvasWrapper: { flex: 1, borderRadius: 15, margin: 10, overflow: 'hidden' },
  drawingBoard: { flex: 1 },
  bottomMenu: { padding: 15, alignItems: 'center' },
  toolRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  bubble: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#FFF', margin: 5 },
  brushBtn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, backgroundColor: '#1e293b', borderWidth: 2, borderColor: '#FFF', margin: 5 },
  toolBtn: { width: 55, height: 55, borderRadius: 30, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', margin: 5 },
  activeTool: { borderColor: '#FFD700', borderWidth: 3 },
  clearBtn: { backgroundColor: '#F43F5E', padding: 14, borderRadius: 20, marginTop: 15 },
  clearText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  celebrateText: { position: 'absolute', top: '40%', alignSelf: 'center', fontSize: 40, color: '#FFD700', fontWeight: '900' },
  currentColorIndicator: { position: 'absolute', top: 15, left: SCREEN_WIDTH / 2 - 25, width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: '#FFD700' },
});
