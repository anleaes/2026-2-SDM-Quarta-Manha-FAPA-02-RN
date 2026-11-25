import { NOME_APPS } from "@/constants/nome_apps";
import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";


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
            <ScrollView contentContainerStyle={styles.gridBotoes}>
                {/*Iteracao para montar os botoes*/}
                {NOME_APPS.map((apps) => (
                    <Pressable
                        key={apps.id}
                        style={({ pressed, hovered}: any) => [
                            styles.entidadeBotao,
                            {borderLeftColor: apps.color},
                            (pressed || hovered) && {
                                backgroundColor: apps.color,
                                paddingLeft: 18
                            }
                        ]}
                    >
                        {({ pressed, hovered}: any) => (
                            <Text
                                style={[styles.entidadeTexto, (pressed || hovered) && {color: 'black'}]}
                            >{apps.label}</Text>
                        )}
                    </Pressable>
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
    gridBotoes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 12,
        gap: 12
    },
    entidadeBotao: {
        width: '47%',
        minHeight: 80,
        backgroundColor: 'white',
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderLeftWidth: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    entidadeTexto: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    }
})

export default HomeScreen