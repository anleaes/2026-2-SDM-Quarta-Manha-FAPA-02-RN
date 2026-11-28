import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Espectador } from "../espectador/EspectadoresScreen";
import { Funcionario } from "../funcionario/FuncionariosScreen";


type Props = DrawerScreenProps<DrawerParamList, "Venda">

export type Venda = {
    id: number,
    funcionario: number,
    pagador: number,
    preco_total: string,
    ultima_edicao: string,
    status: string
}

const COR_CUPOM = 'rgb(199, 216, 50)'
const COR_CUPOM_SEC = 'rgba(255, 255, 0, 0.151)'

const VendasScreen = ({navigation}: Props) => {
    
    const [venda, setVenda] = useState<Venda[]>([])
    const [funcionario, setFuncionario] = useState<Funcionario[]>([])
    const [pagador, setPagador] = useState<Espectador[]>([])
    const [carregamento, setCarregamento] = useState(true)

    const fetchDados = async() => {
        setCarregamento(true)
        const [resVenda, resFuncionario, resEspectador] = await Promise.all([
            fetch('http://localhost:8000/venda/', { cache: 'no-store'}),
            fetch('http://localhost:8000/funcionario/', { cache: 'no-store'}),
            fetch('http://localhost:8000/espectador/', { cache: 'no-store'})
        ])
        const dataVenda = await resVenda.json()
        const dataFuncionario = await resFuncionario.json()
        const dataEspectador = await resEspectador.json()
        setVenda(dataVenda)
        setFuncionario(dataFuncionario)
        setPagador(dataEspectador)
        setCarregamento(false)
    }

    useFocusEffect(
        useCallback(() => {
            fetchDados()
        }, [])
    )

    const handleDelete = async (id: number) => {
        const res = await fetch(`http://localhost:8000/venda/${id}/`, {
            method: 'DELETE',
        })
        setVenda(prev => prev.filter(venda => venda.id !== id))
    }

    //converter ID do funcionario para nome
    const getNomeFuncionario = (id:number) => {
        const encontrado = funcionario.find((f) => f.id === id)
        return encontrado ? encontrado.nome : `Funcionario #${id}`
    }
    
    //converter ID do espectador para nome
    const getNomePagador = (id:number) => {
        const encontrado = pagador.find((p) => p.id === id)
        return encontrado ? encontrado.nome : `Pagador #${id}`
    }

    const renderItem = ({item}: {item: Venda}) => (
        <View style={styles.card}>

            {/*Botoes card*/}
            <View style={styles.cardBotoes}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>  {} /*navigation.navigate("EditarDivulgacaoEvento", {venda: item})*/}
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


            {/*Linha tracejada*/}
            <View style={styles.containerCabecalho}>
                <Text style={styles.nome}>VENDA : #{item.id}</Text>
            </View>

            {/*ID*/}
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> ID: </Text>
                {item.id}
            </Text>

            {/*Funcionario*/}
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> Funcionario: </Text>
                {getNomeFuncionario(item.funcionario)}
            </Text>

            {/*Pagador*/}
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> Pagador: </Text>
                {getNomePagador(item.pagador)}
            </Text>

            

            {/*Preço Base*/} 
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> Preço Total: </Text>
                R${item.preco_total}
            </Text>

            {/*Data*/} 
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> Ultima Edição: </Text>
                {item.ultima_edicao}
            </Text>

            {/*Status*/} 
            <Text style={styles.campoTexto}>
                <Text style={styles.label}> Status: </Text>
                {item.status}
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


export default VendasScreen