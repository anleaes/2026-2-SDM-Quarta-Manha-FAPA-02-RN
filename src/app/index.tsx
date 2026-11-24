import DrawerNavigator from '@/navigation/DrawNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from "expo";

const App = () => (
  <NavigationContainer>
    <DrawerNavigator></DrawerNavigator>
  </NavigationContainer>
)

registerRootComponent(App)