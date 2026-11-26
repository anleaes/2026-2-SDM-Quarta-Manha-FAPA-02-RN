
import CriarEventoScreen from '@/screens/evento/CriarEventoScreen';
import EditarEventoScreen from '@/screens/evento/EditarEventoScreen';
import EventosScreen, { Evento } from '@/screens/evento/EventosScreen';

import CriarSedeScreen from '@/screens/sede/CriarSedeScreen';
import EditarSedeScreen from '@/screens/sede/EditarSedeScreen';
import SedesScreen, { Sede } from '@/screens/sede/SedesScreen';

import HomeScreen from '@/screens/Homescreen';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';

export type DrawerParamList = {
    Home: undefined,
    Evento: undefined,
    CriarEvento: undefined,
    EditarEvento: {evento: Evento},

    Sede: undefined,
    CriarSede: undefined,
    EditarSede: {sede: Sede}
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
            />
            <Drawer.Screen
                name='Evento'
                component={EventosScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color}  />,
                    title: 'Eventos',
                }}
            />
            <Drawer.Screen
                name='CriarEvento'
                component={CriarEventoScreen}
                options={{
                    drawerItemStyle: { display: 'none'},
                    title: 'Criar Evento',
                }}
            />
            <Drawer.Screen
                name='EditarEvento'
                component={EditarEventoScreen}
                options={{
                    drawerItemStyle: { display: 'none'},
                    title: 'Editar Evento',
                }}
            />
            
            <Drawer.Screen
                name='Sede'
                component={SedesScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color}  />,
                    title: 'Sedes',
                }}
            />
            <Drawer.Screen
                name='CriarSede'
                component={CriarSedeScreen}
                options={{
                    drawerItemStyle: { display: 'none'},
                    title: 'Criar Sede',
                }}
            />
             <Drawer.Screen
                name='EditarSede'
                component={EditarSedeScreen}
                options={{
                    drawerItemStyle: { display: 'none'},
                    title: 'Editar Sede',
                }}
            />


        </Drawer.Navigator>
    )
}

export default DrawerNavigator