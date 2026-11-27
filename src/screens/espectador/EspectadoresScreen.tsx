import { DrawerParamList } from "@/navigation/DrawNavigator";
import Ionicons from "@react-native-vector-icons/ionicons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Sede } from "../sede/SedesScreen";


type Props = DrawerScreenProps<DrawerParamList, 'Espectador'>

export type Espectador = {
    id: number;

    nome: string;
    data_nascimento: string;
    telefone: string;
    email: string;
    genero: string;

    sede_de_registro: number

    ads_por_email: boolean
}

const EspectadoresScreen = ({navigation}: Props) => {
    const [espectadores, setEspectadores] = useState<Espectador[]>([])
    const [sedes, setSedes] = useState<Sede[]>([])
    const [carregamento, setCarregamento] = useState(true)

    const fetchEspectadores = async() => {
        setCarregamento(true)

        const [resEspectadores, resSedes] = await Promise.all([
            fetch('http://localhost:8000/espectador/', { cache: 'no-store'}),
            fetch('http://localhost:8000/sede/', { cache: 'no-store'})
        ]) 

        const dataEspectador = await resEspectadores.json()
        const dataSede = await resSedes.json()
        setEspectadores(dataEspectador)
        setSedes(dataSede)
        setCarregamento(false)
    }

      useFocusEffect(
        useCallback(() => {
            fetchEspectadores()
        }, [])
    )

    const handleDelete = async (id: number) => {
        const res = await fetch(`http://localhost:8000/espectador/${id}/`, {
            method: 'DELETE',
        })
        setEspectadores(prev => prev.filter(espectador => espectador.id !== id))
    }

    const getNomeSede = (idSede: number) => {
        const sede = sedes.find((s) => s.id === idSede)
        return sede ? sede.nome : `Sede #${idSede}`
    } 

     const renderItem = ({item}: {item: Espectador}) => (
        <View style={styles.card}>
            
            {/* Botoes */}
            <View style={styles.cardBotoes}>
                <TouchableOpacity
                    style= {styles.editButton}
                    onPress={() => {} /*navigation.navigate('EditarEspectador', { espectador: item})*/}
                >
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                >
                    <Text style={styles.buttonText}>Deletar</Text>
                </TouchableOpacity>
            </View>

            {/*Cabecalio*/}
            <View style={styles.containerCabecalho}>
                <Text style={styles.nome}>{item.nome}</Text>
            </View>

            {/* Corpo */}

            <Text style={styles.campoTexto}>
                <Text style={styles.label}>ID: </Text>
                {item.id}
            </Text>

            <Text style={styles.campoTexto}>
                <Text style={styles.label}>Nome: </Text>
                {item.nome}
            </Text>


            <Text style={styles.campoTexto}>
                <Text style={styles.label}>Data de Nascimento: </Text>
                {item.data_nascimento}
            </Text>


            <Text style={styles.campoTexto}>
                <Text style={styles.label}>Telefone: </Text>
                {item.telefone}
            </Text>

            <Text style={styles.campoTexto}>
                <Text style={styles.label}>Email: </Text>
                {item.email}
            </Text>

            <Text style={styles.campoTexto}>
                <Text style={styles.label}>Gênero: </Text>
                {item.genero}
            </Text>

            <Text style={styles.campoTexto}>
                <Text style={styles.label}>Sede de Registro: </Text>
                {getNomeSede(item.sede_de_registro)}
            </Text>

            <Text style={styles.campoTexto}>
                <Text style={styles.label}>Ads Por Email: </Text>
                {String(item.ads_por_email)}
            </Text>

        </View>
    )


    return (
        <View style={styles.container}>

            {/* <Image
                source={require('@/assets/images/bg_padrao.jpg')}
                style={[StyleSheet.absoluteFill, styles.bgImage]}
                resizeMode="cover"
            /> */}

            <Text style={styles.titulo}>Espectadores</Text>
            {carregamento ? (
                <ActivityIndicator size="large" color='rgb(221, 169, 58)'/>
            ) : (
                <FlatList
                    data={espectadores}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle = {{paddingBottom: 20}}
                    style={styles.listaContainer}
                />
            )}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {} /* { navigation.navigate('CriarEspectador') }*/}
            >
                <Ionicons name="add" size={28} color="#fff"/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
     container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        paddingHorizontal: 16,
        paddingTop: 12
    },
    bgImage: {
        width: '100%',
        height: '100%'
    },
    titulo: {
        textAlign: 'center',
        fontSize: 40,
        fontWeight: "900",
        color: '#111',
        marginBottom: 16,
        textShadowColor: 'gray',
        textShadowOffset: { width: 0, height: 4},
        textShadowRadius: 2
    },
    listaContainer: {
        paddingBottom: 110
    },
    card: {
        backgroundColor: 'rgba(221, 169, 58, 0.25)',
        borderColor: 'rgb(221, 169, 58)',
        padding: 12,
        borderRadius: 14,
        borderWidth: 3,
        marginBottom: 16,
    },
    containerCabecalho: {
        borderBottomWidth: 3,
        borderBottomColor: 'rgb(221, 169, 58)',
        borderStyle: 'dashed',
        paddingBottom: 6,
        marginBottom: 8
    },
    nome: {
        fontSize: 22,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#111'
    },
    campoTexto: {
        fontSize: 14,
        color: "#111",
        marginBottom: 4,
        flexShrink: 1
    },
    label: {
        fontWeight: 'bold',
        fontSize: 14,
        color: "#111"
    },

    linhaCampo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
  
    cardBotoes: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginBottom: 4
    },
    editButton: {
        backgroundColor: 'rgba(255, 230, 0, 0.9)',
        borderWidth: 1,
        borderColor: '#444',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    buttonText: {
        color: '#111',
        fontWeight: 'bold',
        fontSize: 13
    },
    deleteButton: {
        backgroundColor: 'rgba(255,0,0, 0.85)',
        borderWidth: 1,
        borderColor: '#444',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    fab: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 20,
        width: 72,
        height: 72,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 36,
        borderWidth: 1,
        borderColor: 'rgb(56,56,56)',
        backgroundColor: 'rgb(2, 109, 25)',
        elevation: 4
    }
})

export default EspectadoresScreen