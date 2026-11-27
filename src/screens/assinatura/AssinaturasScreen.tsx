import { DrawerParamList } from "@/navigation/DrawNavigator";
import Ionicons from "@react-native-vector-icons/ionicons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Beneficio } from "../beneficio/BeneficiosScreen";


type Props = DrawerScreenProps<DrawerParamList, 'Assinatura'>

export type Assinatura = {
    id: number;
    icone: string;
    nome: string;
    descricao: string;
    custo_mensal: string;
    beneficios: number[];
}

const AssinaturasScreen = ({navigation}: Props) => {
    const [assinaturas, setAssinaturas] = useState<Assinatura[]>([])
    const [beneficios, setBeneficios] = useState<Beneficio[]>([])
    const [carregamento, setCarregamento] = useState(true)

    const fetchAssinaturas = async() => {
        setCarregamento(true)
        const [resAssinaturas, resBeneficios] = await Promise.all([
            fetch('http://localhost:8000/assinatura/', { cache: 'no-store'}),
            fetch('http://localhost:8000/beneficio/', { cache: 'no-store'})
        ]) 

        const dataAssinatura = await resAssinaturas.json()
        const dataBeneficio = await resBeneficios.json()
        setAssinaturas(dataAssinatura)
        setBeneficios(dataBeneficio)

        setCarregamento(false)
    }

    useFocusEffect(
        useCallback(() => {
            fetchAssinaturas()
        }, [])
    )


    const handleDelete = async (id: number) => {
        const res = await fetch(`http://localhost:8000/assinatura/${id}/`, {
            method: 'DELETE',
        })
        setAssinaturas(prev => prev.filter(assinatura => assinatura.id !== id))
    }

    const getNomeBeneficio = (idBeneficio: number) => {
        const beneficio = beneficios.find((b) => b.id === idBeneficio)
        return beneficio ? beneficio.nome : `Sede #${idBeneficio}`
    } 

    const renderItem = ({item}: {item: Assinatura}) => (
        <View style={styles.card}>

            {/*Botoes do card*/}
            <View style={styles.cardBotoes}>
                <TouchableOpacity
                    style= {styles.editButton}
                    onPress={() => {} /* navigation.navigate('EditarAssinatura', { assinatura: item})*/ }
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

            {/*Container*/}
            <View style={styles.containerCabecalho}>
                <Text style={styles.nome}>{item.nome}</Text>
            </View>
            

            {/*Corpo*/}

            <Text style={styles.campoTexto}>
                <Text style={styles.label}>ID: </Text>
                {item.id}
            </Text>

            <View style={styles.banner}>
                <Text style={styles.label}>Ícone:</Text>
                {item.icone ? (
                    <Image
                        source={{
                            uri: item.icone.startsWith("http") ? item.icone : `http://localhost:8000${item.icone}`
                        }}
                        style={styles.bannerThumb}
                        resizeMode="cover"
                    />
                ): (
                    <Text style={styles.campoTexto}>Sem Imagem</Text>
                )}
            </View>

            <Text style={styles.campoTexto}>
                <Text style={styles.label}>Nome: </Text>
                {item.nome}
            </Text>

            <Text style={styles.campoTexto}>
                <Text style={styles.label}>Descrição: </Text>
                {item.descricao}
            </Text>

            <Text style={styles.campoTexto}>
                <Text style={styles.label}>Custo Mensal: </Text>
                {item.custo_mensal}
            </Text>

            <Text style={styles.label}>[ Benefícios ]</Text>
            <View>
                {item.beneficios.map((beneficioId) => (
                                        <Text key={beneficioId} style={styles.itemBeneficio}>
                                            • {getNomeBeneficio(beneficioId)}
                                        </Text>
                                    ))}
            </View>

            


            

        </View>
    )


    return (
        <View style={styles.container}>

            {/*Adicionar o background image*/}
            <Image
                source={require('@/assets/images/bg_padrao.jpg')}
                style={[StyleSheet.absoluteFill, styles.bgImage]}
                resizeMode="cover"
            />

            <Text style={styles.titulo}>Assinaturas</Text>
            {carregamento ? (
                <ActivityIndicator size="large" color="rgb(2, 109, 25)"/>
            ) : (
                <FlatList
                    data={assinaturas}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle = {{paddingBottom: 20}}
                    style={styles.listaContainer}
                />
            )}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {} /*navigation.navigate('CriarAssinatura')*/ }
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
    itemBeneficio: {
        fontSize: 14,
        color: '#111',
        marginBottom: 2
    },
    card: {
        backgroundColor: 'rgba(207, 67, 67, 0.23)',
        borderColor: 'rgb(207, 67, 67)',
        padding: 12,
        borderRadius: 14,
        borderWidth: 3,
        marginBottom: 16,
    },
    containerCabecalho: {
        borderBottomWidth: 3,
        borderBottomColor: 'rgb(207, 67, 67)',
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
    banner:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    bannerThumb:{
        width: 70,
        height: 24,
        borderRadius: 4,
        backgroundColor: '#222'
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

export default AssinaturasScreen