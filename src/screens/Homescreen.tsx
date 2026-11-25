import { NOME_APPS } from "@/constants/nome_apps";
import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type Props = DrawerScreenProps<DrawerParamList, 'Home'>

const HomeScreen = ({navigation} : Props) => {
    return (
        <View style={styles.container}>
            {/*Grid do banner*/}
            <View>
                <Image source={require('@/assets/images/ticket.png')}/>
                <Text>TEMPLATE</Text>
                <Text>VOCÊ FAZ ISSO FUNCIONAR</Text>
            </View>
            {/*Grid dos botoes*/}
            <ScrollView>
                {/*Iteracao para montar os botoes*/}
                {NOME_APPS.map((apps) => (
                    <TouchableOpacity
                        key={apps.id}
                        style={styles.entidadeBotao}
                    >
                        <Text>{apps.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    entidadeBotao: {
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderLeftWidth: 5,
    }
})

export default HomeScreen