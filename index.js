import { registerRootComponent } from 'expo';
import App from './src/App';
import { initDatabase } from './src/services/database';

// Initialize database on app start
initDatabase().catch(console.error);

registerRootComponent(App);
