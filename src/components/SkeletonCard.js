import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../utils/theme';

function ShimmerBlock({ style }) {
  const { theme } = useTheme();
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  return (
    <Animated.View
      style={[
        styles.shimmer,
        { backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', opacity: anim },
        style,
      ]}
    />
  );
}

export default function SkeletonCard({ index = 0 }) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  return (
    <Animated.View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.inputBorder, opacity: fadeAnim }]}>
      {/* Header: number + category badge */}
      <View style={styles.header}>
        <ShimmerBlock style={styles.numberBlock} />
        <ShimmerBlock style={styles.catBlock} />
        <ShimmerBlock style={styles.favBlock} />
      </View>

      {/* Title lines */}
      <ShimmerBlock style={[styles.line, { width: '95%' }]} />
      <ShimmerBlock style={[styles.line, { width: '75%' }]} />

      {/* Description lines */}
      <ShimmerBlock style={[styles.line, styles.descLine, { width: '100%' }]} />
      <ShimmerBlock style={[styles.line, styles.descLine, { width: '85%' }]} />
      <ShimmerBlock style={[styles.line, styles.descLine, { width: '60%' }]} />

      {/* Footer: source + time */}
      <View style={[styles.footer, { borderTopColor: theme.footerBorder }]}>
        <ShimmerBlock style={styles.sourceBlock} />
        <ShimmerBlock style={styles.timeBlock} />
      </View>
    </Animated.View>
  );
}

export function SkeletonFilterChips() {
  return (
    <View style={styles.chipsRow}>
      <ShimmerBlock style={[styles.chipBlock, { width: 60 }]} />
      <ShimmerBlock style={[styles.chipBlock, { width: 100 }]} />
      <ShimmerBlock style={[styles.chipBlock, { width: 80 }]} />
      <ShimmerBlock style={[styles.chipBlock, { width: 70 }]} />
    </View>
  );
}

export function SkeletonSearchBar() {
  const { theme } = useTheme();
  return (
    <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
      <ShimmerBlock style={styles.searchIcon} />
      <ShimmerBlock style={[styles.line, { width: '60%', height: 12 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  shimmer: {
    borderRadius: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  numberBlock: {
    width: 30,
    height: 30,
    borderRadius: 10,
  },
  catBlock: {
    width: 90,
    height: 24,
    borderRadius: 12,
  },
  favBlock: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginLeft: 'auto',
  },
  line: {
    height: 14,
    marginBottom: 8,
    borderRadius: 7,
  },
  descLine: {
    height: 10,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    marginTop: 6,
    borderTopWidth: 1,
  },
  sourceBlock: {
    width: 80,
    height: 12,
    borderRadius: 6,
  },
  timeBlock: {
    width: 60,
    height: 12,
    borderRadius: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  chipBlock: {
    height: 30,
    borderRadius: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});
