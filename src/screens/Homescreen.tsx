import { NOME_APPS } from "@/constants/nome_apps";
import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";


type Props = DrawerScreenProps<DrawerParamList, 'Home'>

const HomeScreen = ({navigation} : Props) => {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/bg_padrao.jpg')}
                style={[StyleSheet.absoluteFill, styles.bgImage]}
                resizeMode="cover"
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/*Grid do banner*/}
                <View style={styles.apresentacao}>
                    <Image style={styles.logo} resizeMode="contain" source={require('@/assets/images/ticket.png')}/>
                    <Text style={styles.titulo}>TEMPLATE</Text>
                    <Text style={styles.descricao}>VOCÊ FAZ ISSO FUNCIONAR</Text>
                </View>
                {/*Grid dos botoes*/}
                <View style={styles.gridBotoes}>
                    {/*Iteracao para montar os botoes*/}
                    {NOME_APPS.map((apps) => (
                        <Pressable
                            key={apps.id}
                            onPress={() => {
                                if(apps.route){
                                    navigation.navigate(apps.route)
                                }
                            }}
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
                                    style={[styles.entidadeTexto, 
                                    (pressed || hovered) && {color: 'black'}]}
                                >
                                    {apps.label}
                                </Text>
                            )}
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    bgImage: {
        width: '100%',
        height: '100%'
    },
    apresentacao: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'black'
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 24
    },
    logo: {
        width: 90,
        height: 90,
        marginBottom: 8
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
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 1
    },
    entidadeTexto: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    }
})

export default HomeScreen