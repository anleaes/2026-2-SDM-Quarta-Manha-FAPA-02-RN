
import CriarEventoScreen from '@/screens/evento/CriarEventoScreen';
import EditarEventoScreen from '@/screens/evento/EditarEventoScreen';
import EventosScreen, { Evento } from '@/screens/evento/EventosScreen';

import CriarSedeScreen from '@/screens/sede/CriarSedeScreen';
import EditarSedeScreen from '@/screens/sede/EditarSedeScreen';
import SedesScreen, { Sede } from '@/screens/sede/SedesScreen';

import CriarCupomScreen from '@/screens/cupom/CriarCupomScreen';
import CuponsScreen, { Cupom } from '@/screens/cupom/CuponsScreen';
import EditarCupomScreen from '@/screens/cupom/EditarCupomScreen';

import BeneficiosScreen, { Beneficio } from '@/screens/beneficio/BeneficiosScreen';
import CriarBeneficioScreen from '@/screens/beneficio/CriarBeneficioScreen';
import EditarBeneficioScreen from '@/screens/beneficio/EditarBeneficioScreen';


import CriarDivulgacaoEvento from '@/screens/divulgacao_evento/CriarDivulgacaoEventosScreen';
import DivulgacaoEventoScreen, { DivulgacaoEvento } from '@/screens/divulgacao_evento/DivulgacaoEventosScreen';
import CriarEspectadorScreen from '@/screens/espectador/CriarEspectadorScreen';
import EditarEspectadorScreen from '@/screens/espectador/EditarEspectadorScreen';
import EspectadoresScreen, { Espectador } from '@/screens/espectador/EspectadoresScreen';

import EditarDivulgacaoEventoScreen from '@/screens/divulgacao_evento/EditarDivulgacaoEventosScreen';
import HomeScreen from '@/screens/HomeScreen';
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
    EditarSede: {sede: Sede},

    Cupom: undefined,
    CriarCupom: undefined,
    EditarCupom: {cupom: Cupom},
  
    Beneficio: undefined,
    CriarBeneficio: undefined,
    EditarBeneficio: {beneficio: Beneficio},

    DivulgacaoEvento: undefined,
    CriarDivulgacaoEvento: undefined,
    EditarDivulgacaoEvento: {divulgacao_evento: DivulgacaoEvento}

    Espectador: undefined,
    CriarEspectador: undefined,
    EditarEspectador: {espectador: Espectador},
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

            <Drawer.Screen
                name='Cupom'
                component={CuponsScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color}  />,
                    title: 'Cupons',
                }}
            />
            <Drawer.Screen
                name='CriarCupom'
                component={CriarCupomScreen}
                options={{
                    drawerItemStyle: { display: 'none'},
                    title: 'Criar Cupom',
                }}
            />
            <Drawer.Screen
                name='EditarCupom'
                component={EditarCupomScreen}
                options={{
                    drawerItemStyle: { display: 'none'},
                    title: 'Editar Cupom',
                }}
            />
        
            <Drawer.Screen         
                name='Beneficio'
                component={BeneficiosScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color}  />,
                    title: 'Beneficios',
                }}
            />
             <Drawer.Screen
                name='CriarBeneficio'
                component={CriarBeneficioScreen}
                options={{
                    drawerItemStyle: { display: 'none'},
                    title: 'Criar Beneficio',
                }}
            />
             <Drawer.Screen
                name='EditarBeneficio'
                component={EditarBeneficioScreen}
                options={{
                    drawerItemStyle: { display: 'none'},
                    title: 'Editar Beneficio',
                }}
            />
            <Drawer.Screen         
                name='DivulgacaoEvento'
                component={DivulgacaoEventoScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color}  />,
                    title: 'Divulgação de Eventos',
                }}
            />
            <Drawer.Screen         
                name='CriarDivulgacaoEvento'
                component={CriarDivulgacaoEvento}
                options={{
                    drawerItemStyle: { display: 'none'},
                    title: 'Criar Divulgação de Eventos',
                }}
            />
            <Drawer.Screen         
                name='EditarDivulgacaoEvento'
                component={EditarDivulgacaoEventoScreen}
                options={{
                    drawerItemStyle: { display: 'none'},
                    title: 'Editar Divulgação de Eventos',
                }}
            />

            <Drawer.Screen         
                name='Espectador'
                component={EspectadoresScreen}
                options={{
                    drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color}  />,
                    title: 'Espectador',
                }}
            />
            <Drawer.Screen
                name='CriarEspectador'
                component={CriarEspectadorScreen}
                options={{
                    drawerItemStyle: { display: 'none'},
                    title: 'Criar Espectador',
                }}
            />
            <Drawer.Screen
                name='EditarEspectador'
                component={EditarEspectadorScreen}
                options={{
                    drawerItemStyle: { display: 'none'},
                    title: 'Editar Espectador',
                }}
            />


        </Drawer.Navigator>
    )
}

export default DrawerNavigator