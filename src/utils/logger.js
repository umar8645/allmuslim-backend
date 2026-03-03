const levels = ['error', 'warn', 'info', 'debug'];

const currentLevel = process.env.LOG_LEVEL || 'info';

function canLog(level) {
  return levels.indexOf(level) <= levels.indexOf(currentLevel);
}

export const logger = {
  error: (...args) => canLog('error') && console.error('❌', ...args),
  warn: (...args) => canLog('warn') && console.warn('⚠️', ...args),
  info: (...args) => canLog('info') && console.log('ℹ️', ...args),
  debug: (...args) => canLog('debug') && console.log('🐛', ...args),
};