import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sentry from '@sentry/react-native';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Ionicons name="warning-outline" size={64} color="#f87171" />
          <Text style={styles.title}>Oups, une erreur est survenue</Text>
          <Text style={styles.message}>
            L'application a rencontré un problème inattendu.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.detail}>{this.state.error.toString()}</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.buttonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#030810',
    padding: 32,
  },
  title: {
    color: '#e2e8f0',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    textAlign: 'center',
  },
  message: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
  detail: {
    color: '#f87171',
    fontSize: 12,
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(248,113,113,0.1)',
    borderRadius: 8,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
    backgroundColor: 'rgba(165,180,252,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(165,180,252,0.3)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#a5b4fc',
    fontSize: 16,
    fontWeight: '600',
  },
});
