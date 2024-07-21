import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './navigations/AppNavigation';
import { LogBox } from 'react-native';
import 'intl-pluralrules';
import './i18n';

//Ignore all log notifications
LogBox.ignoreAllLogs();

export default function App() {
  return (
      <SafeAreaProvider>
        <AppNavigation />
      </SafeAreaProvider>
  );
}