/**
 * Application Constants
 * Centralized location for all constant values used across the app
 * Following best practice: Avoid hardcoding, use constants
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_ENDPOINTS = {
  PING: '/api/ping',
  CONVERSATIONS: '/api/conversations',
  AI_RESPONSE: '/api/ai/response',
  SIGNUP: '/api/auth/register',
  LOGIN: '/api/auth/login',
} as const;

// Application Constants
export const APP_NAME = 'Contexta';
export const APP_DESCRIPTION = 'AI-powered real-time conversation intelligence';

// UI Constants
export const COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#64748b',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  DASHBOARD: '/dashboard',
  CONVERSATION: '/conversation',
  SETTINGS: '/settings',
  LOGIN: '/login',
} as const;
