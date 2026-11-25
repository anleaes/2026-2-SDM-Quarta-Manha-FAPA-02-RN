import DrawerNavigator from '@/navigation/DrawNavigator';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';

export default function App() {
    return (
        <NavigationIndependentTree>
            <NavigationContainer>
                <DrawerNavigator></DrawerNavigator>
            </NavigationContainer>
        </NavigationIndependentTree>
        
    
    )
}
