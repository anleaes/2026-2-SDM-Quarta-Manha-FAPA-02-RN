
import HomeScreen from '@/screens/HomeScreen';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';

export type DrawerParamList = {
    Home: undefined
}

const Drawer = createDrawerNavigator<DrawerParamList>()


const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerActiveTintColor: '#4B7BE5',
                drawerLabelStyle: { marginLeft: 0, fontSize: 16 },
                drawerStyle: { backgroundColor: '#fff', width: 250 },
                headerStyle: { backgroundColor: '#4B7BE5' },
                headerTintColor: '#fff',
            }}
        >
        
            <Drawer.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color}  />,
                    title: 'Início',
                }}
            >

            </Drawer.Screen>

        </Drawer.Navigator>
    )
}

export default DrawerNavigator