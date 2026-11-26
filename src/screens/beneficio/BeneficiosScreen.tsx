import { DrawerParamList } from "@/navigation/DrawNavigator";
import Ionicons from "@react-native-vector-icons/ionicons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = DrawerScreenProps<DrawerParamList, 'Beneficio'>

export type Beneficio = {
    id: number;
    nome: string;
    descricao: string;
}

const BeneficiosScreen = ({navigation}: Props) => {
    const [beneficios, setBeneficios] = useState<Beneficio[]>([])
    const [carregamento, setCarregamento] = useState(true)

    const fetchBeneficios = async() => {
        setCarregamento(true)
        const response = await fetch('http://localhost:8000/beneficio/', { cache: 'no-store'})
        const data = await response.json()
        setBeneficios(data)
        setCarregamento(false)
    }

      useFocusEffect(
        useCallback(() => {
            fetchBeneficios()
        }, [])
    )

    const handleDelete = async (id: number) => {
        const res = await fetch(`http://localhost:8000/beneficio/${id}/`, {
            method: 'DELETE',
        })
        setBeneficios(prev => prev.filter(beneficio => beneficio.id !== id))
    }

     const renderItem = ({item}: {item: Beneficio}) => (
        <View style={styles.card}>
            
            {/* Botoes */}
            <View style={styles.cardBotoes}>
                <TouchableOpacity
                    style= {styles.editButton}
                    onPress={() => {}/*navigation.navigate('EditarBeneficio', { beneficio: item})*/}
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
                <Text style={styles.label}>Descrição: </Text>
                {item.descricao}
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

            <Text style={styles.titulo}>Benefícios</Text>
            {carregamento ? (
                <ActivityIndicator size="large" color='rgb(137, 87, 202)'/>
            ) : (
                <FlatList
                    data={beneficios}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle = {{paddingBottom: 20}}
                    style={styles.listaContainer}
                />
            )}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => { /*navigation.navigate('CriarBeneficio')*/ }}
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
        backgroundColor: 'rgba(137, 87, 202, 0.26)',
        borderColor: 'rgb(137, 87, 202)',
        padding: 12,
        borderRadius: 14,
        borderWidth: 3,
        marginBottom: 16,
    },
    containerCabecalho: {
        borderBottomWidth: 3,
        borderBottomColor: 'rgb(137, 87, 202)',
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

export default BeneficiosScreen