import WebSocket from 'ws';
import { Player, Winner } from '../types';

export const connections = new Map<string, WebSocket>();
export const players = new Map<string, Player>();
export const winners = new Map<string, Winner>();
