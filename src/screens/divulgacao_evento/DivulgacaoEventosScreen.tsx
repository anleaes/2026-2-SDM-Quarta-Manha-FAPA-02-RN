import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Evento } from "../evento/EventosScreen";


type Props = DrawerScreenProps<DrawerParamList, 'DivulgacaoEvento'>

export type DivulgacaoEvento = {
    id: number,
    evento: number,
    local: number,
    data: string,
    horarioComeco: string,
    horarioFim: string,
    precoBase: string
}

const COR_CUPOM = 'rgb(145, 145, 145)'
const COR_CUPOM_SEC = 'rgba(54, 54, 54, 0.151)'




const DivulgacaoEventoScreen = ({navigation}: Props) => {

    

    const [divulgacaoEvento, setDivulgacaoEvento] = useState<DivulgacaoEvento[]>([])
    const [eventos, setEventos] = useState<Evento[]>([])
    const [carregamento, setCarregamento] = useState(true)
    
    const fetchDados = async() => {
        setCarregamento(true)
        const [resDivulgacaoEvento, resEventos] = await Promise.all([
            fetch('http://localhost:8000/divulgacao_evento/', { cache: 'no-store'}),
            fetch('http://localhost:8000/evento/', { cache: 'no-store'})
        ])
        const dataDivulgacaoEvento = await resDivulgacaoEvento.json()
        const dataEvento = await resEventos.json()
        setDivulgacaoEvento(dataDivulgacaoEvento)
        setEventos(dataEvento)
        setCarregamento(false)
    }
    
    useFocusEffect(
        useCallback(() => {
            fetchDados()
        }, [])
    )
    
    const handleDelete = async (id: number) => {
        const res = await fetch(`http://localhost:8000/divulgacao_evento/${id}/`, {
            method: 'DELETE',
        })
        setDivulgacaoEvento(prev => prev.filter(cupom => cupom.id !== id))
    }

    //converter ID do evento para nome
    const getNomeEvento = (id:number) => {
        const encontrado = eventos.find((e) => e.id === id)
        return encontrado ? encontrado.nome : `Evento #${id}`
    }
    
    const renderItem = ({item}: {item: DivulgacaoEvento}) => (
        <View style={styles.card}>

            {/*Botoes card*/}
            <View style={styles.cardBotoes}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>  {} /*navigation.navigate("EditarDivulgacaoEvento", {divulgacao_evento: item})*/}
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
                <Text style={styles.nome}>DIVULGAÇÃO EVENTO: #{item.id}</Text>
            </View>

            {/*ID*/}
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> ID:</Text>
                {item.id}
            </Text>

            {/*Evento*/}
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> Evento:</Text>
                {getNomeEvento(item.evento)}
            </Text>

            {/*Local*/}
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> Data de Vencimento:</Text>
                {item.local}
            </Text>


            {/*Data*/} 
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> Data de Vencimento:</Text>
                {item.data}
            </Text>

            {/*Horario comeco*/} 
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> Horario comeco:</Text>
                {item.horarioComeco}
            </Text>

            {/*Horario fim*/} 
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> Horario fim:</Text>
                {item.horarioFim}
            </Text>

            {/*Preço Base*/} 
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> Preço Base:</Text>
                {item.precoBase}
            </Text>
        </View>
    )


    return null
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



export default DivulgacaoEventoScreen