import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ChromeCorners() {
  return (
    <>
      <View style={[s.h, { top: 8, left: 8 }]} />
      <View style={[s.v, { top: 8, left: 8 }]} />
      <View style={[s.h, { top: 8, right: 8 }]} />
      <View style={[s.v, { top: 8, right: 8 }]} />
      <View style={[s.h, { bottom: 8, left: 8 }]} />
      <View style={[s.v, { bottom: 8, left: 8 }]} />
      <View style={[s.h, { bottom: 8, right: 8 }]} />
      <View style={[s.v, { bottom: 8, right: 8 }]} />
    </>
  );
}

const s = StyleSheet.create({
  h: {
    position: 'absolute',
    width: 12,
    height: 2,
    backgroundColor: '#c0c0c0',
    borderRadius: 1,
  },
  v: {
    position: 'absolute',
    width: 2,
    height: 12,
    backgroundColor: '#c0c0c0',
    borderRadius: 1,
  },
});
