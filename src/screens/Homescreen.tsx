import { NOME_APPS } from "@/constants/nome_apps";
import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type Props = DrawerScreenProps<DrawerParamList, 'Home'>

const HomeScreen = ({navigation} : Props) => {
    return (
        <View style={styles.container}>
            {/*Grid do banner*/}
            <View style={styles.apresentacao}>
                <Image source={require('@/assets/images/ticket.png')}/>
                <Text style={styles.titulo}>TEMPLATE</Text>
                <Text style={styles.descricao}>VOCÊ FAZ ISSO FUNCIONAR</Text>
            </View>
            {/*Grid dos botoes*/}
            <ScrollView>
                {/*Iteracao para montar os botoes*/}
                {NOME_APPS.map((apps) => (
                    <TouchableOpacity
                        key={apps.id}
                        style={[styles.entidadeBotao, {borderLeftColor: apps.color}]}
                        activeOpacity={0.6}
                        onPress={() => {}} // adicionar as screens depois
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
    apresentacao: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 25,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'black'
    },
    titulo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'rgb(32,32,32)',
        textAlign: 'center',
        marginBottom: 6
    },
    descricao: {
        fontSize: 16,
        color: 'rgb(32,32,32)',
        textAlign: 'center',
        letterSpacing: 0.5
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