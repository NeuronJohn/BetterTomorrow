import { Text, TextInput } from 'react-native';
import DailyCompanionApp from './src/DailyCompanionApp';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

export default function App() {
  return <DailyCompanionApp />;
}
