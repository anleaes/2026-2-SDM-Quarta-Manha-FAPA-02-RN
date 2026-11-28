import { DrawerParamList } from "@/navigation/DrawNavigator";
import Ionicons from "@react-native-vector-icons/ionicons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Evento } from "../evento/EventosScreen";


type Props = DrawerScreenProps<DrawerParamList, 'Cupom'>

export type Cupom = {
    id: number,
    porcentagem_desconto: number,
    data_vencimento: string,
    eventos_validos: number[]
}

const COR_CUPOM = 'rgb(122, 33, 240)'
const COR_CUPOM_SEC = 'rgba(102, 30, 150, 0.151)'

const CuponsScreen = ({navigation}: Props) => {


    const [cupons, setCupons] = useState<Cupom[]>([])
    const [eventos, setEventos] = useState<Evento[]>([])
    const [carregamento, setCarregamento] = useState(true)


    const fetchDados = async() => {
        setCarregamento(true)
        const [resCupons, resEventos] = await Promise.all([
            fetch('http://localhost:8000/cupom/', { cache: 'no-store'}),
            fetch('http://localhost:8000/evento/', { cache: 'no-store'})
        ])
        const dataCupom = await resCupons.json()
        const dataEvento = await resEventos.json()
        setCupons(dataCupom)
        setEventos(dataEvento)
        setCarregamento(false)
    }

    useFocusEffect(
        useCallback(() => {
            fetchDados()
        }, [])
    )

    const handleDelete = async (id: number) => {
        const res = await fetch(`http://localhost:8000/cupom/${id}/`, {
            method: 'DELETE',
        })
        setCupons(prev => prev.filter(cupom => cupom.id !== id))
    }

    //converter ID do evento para nome
    const getNomeEvento = (id:number) => {
        const encontrado = eventos.find((e) => e.id === id)
        return encontrado ? encontrado.nome : `Evento #${id}`
    }

    
    const renderItem = ({item}: {item: Cupom}) => (
        <View style={styles.card}>

            {/*Botoes card*/}
            <View style={styles.cardBotoes}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>  navigation.navigate("EditarCupom", {cupom: item})}
                >
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                >
                    <Text>Deletar</Text>
                </TouchableOpacity>
            </View>


            {/*Linha tracejada*/}
            <View style={styles.containerCabecalho}>
                <Text style={styles.nome}>CUPOM: #{item.id}</Text>
            </View>

            {/*ID*/}
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> ID:</Text>
                {item.id}
            </Text>

            {/*Porcentagem*/}
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> Porcentagem de desconto:</Text>
                {item.porcentagem_desconto}
            </Text>

            {/*Data vencimento*/}
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> Data de Vencimento:</Text>
                {item.data_vencimento}
            </Text>


            {/*Lista de Eventos validos para o cupom*/} 
            <Text style={[styles.label, {marginTop: 6}]}>[ Eventos Válidos ]</Text>
            <View style={styles.listaEventos}>
                {item.eventos_validos.length > 0 ? (
                    item.eventos_validos.map((eventoId) => (
                        <Text key={eventoId} style={styles.itemEvento}>
                            • {getNomeEvento(eventoId)}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.itemEvento}>
                        Nenhum evento vinculado.
                    </Text>
                )}
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
            
            <Text style={styles.titulo}>Cupons</Text>
            {carregamento ? (
                <ActivityIndicator size="large" color={COR_CUPOM}/>
            ) : (
                <FlatList
                    data={cupons}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle = {{paddingBottom: 110}}
                />
            )}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CriarCupom')}
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
    card: {
        backgroundColor: COR_CUPOM_SEC,
        borderColor: COR_CUPOM,
        padding: 12,
        borderRadius: 14,
        borderWidth: 3,
        marginBottom: 16,
    },
    containerCabecalho: {
        borderBottomWidth: 3,
        borderBottomColor: COR_CUPOM,
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
    listaEventos: {
        marginTop: 4,
        paddingLeft: 14
    },
    itemEvento: {
        fontSize: 14,
        color: '#111',
        marginBottom: 2
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

export default CuponsScreen