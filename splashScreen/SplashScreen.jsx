import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

const SPLIT_PIECES = 10; // Number of crumble pieces
const SPLIT_DURATION = 2000;

const SplashScreen = () => {
  const [crumble, setCrumble] = useState(false);

  // Initialize shared values for animations
  const pieces = Array.from({ length: SPLIT_PIECES }, () => ({
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
    opacity: useSharedValue(1),
    rotate: useSharedValue(0),
  }));

  // Trigger crumble animation after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setCrumble(true);
      animateCrumble();
    }, SPLIT_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const animateCrumble = () => {
    pieces.forEach((piece, index) => {
      const angle = (Math.PI * 2 * index) / SPLIT_PIECES; // Spread direction
      const distance = 100 + Math.random() * 50; // Random spread distance
      piece.translateX.value = withTiming(Math.cos(angle) * distance, { duration: 1500 });
      piece.translateY.value = withTiming(Math.sin(angle) * distance, { duration: 1500 });
      piece.opacity.value = withTiming(0, { duration: 500 });
      piece.rotate.value = withSpring(Math.random() * 360);
    });
  };

  // Precompute animated styles
  const animatedStyles = pieces.map((piece) =>
    useAnimatedStyle(() => ({
      transform: [
        { translateX: piece.translateX.value },
        { translateY: piece.translateY.value },
        { rotate: `${piece.rotate.value}deg` },
      ],
      opacity: piece.opacity.value,
    }))
  );

  return (
    <View style={styles.header}>
      {!crumble ? (
        <Text style={styles.title}>Weather Hunt</Text>
      ) : (
        <View style={styles.piecesContainer}>
          {animatedStyles.map((style, index) => (
            <Animated.Text key={index} style={[styles.title, style]}>
              {`Weather Hunt`[index % `Weather Hunt`.length]}
            </Animated.Text>
          ))}
        </View>
      )}
      <Text style={styles.description}>Discover the Weather Of your Area</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#003366",
  },
  piecesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    color: "#cccccc",
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
