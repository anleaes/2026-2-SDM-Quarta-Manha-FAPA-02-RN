import { DrawerParamList } from "@/navigation/DrawNavigator"
import Ionicons from "@react-native-vector-icons/ionicons"
import { DrawerScreenProps } from "@react-navigation/drawer"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Evento } from "../evento/EventosScreen"

type Props = DrawerScreenProps<DrawerParamList, 'CriarCupom'>

//COR PADRAO DO APP
const COR_ENTIDADE = 'rgb(122, 33, 240)'


const CriarCupomScreen = ({navigation}: Props) => {

    const [porcentagemDesconto, setPorcentagemDesconto] = useState('1')
    const [dataVencimento, setDataVencimento] = useState('')
    //Buscar os eventos validos para o cupom
    const [eventosValidos, setEventosValidos] = useState<Evento[]>([])
    const [eventosSelecionados, setEventosSelecionados] = useState<number[]>([])
    const [saving, setSaving] = useState(false)
    const [erro, setErro] = useState('')



    //Buscar na API os eventos para montar o checkbox m2m
    const fetchEventos = async() => {
        try{
            const res = await fetch('http://localhost:8000/evento/')
            const data = await res.json()
            setEventosValidos(data)
        }catch(e){
            setErro('Não foi possivel carregar a lista de eventos.')
        }
    }

    useFocusEffect(
        useCallback(() => {
            setPorcentagemDesconto('1')
            setDataVencimento('')
            setEventosSelecionados([])
            setErro('')
            fetchEventos()
        }, [])
    )

    //Marcar e Desmarcar o ID do evento no array
    const toggleEvento = (id: number) => {
        setEventosSelecionados((prev) => 
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }


    const handleSave = async() => {
        const valorPorcentagem = parseInt(porcentagemDesconto, 10) // base 10

        if(isNaN(valorPorcentagem) || valorPorcentagem < 1 || valorPorcentagem > 100){
            setErro('A porcentagem de desconto deve ser no minimo 1 até 100.')
            return
        }

        if(!dataVencimento.trim()){
            setErro('Informe a data de vencimento (AAAA-MM-DD).')
            return
        }

        if(eventosSelecionados.length === 0){
            setErro('Selecione pelo menos um evento válido.')
            return
        }

        setErro('')
        setSaving(true)

        try{
            const res = await fetch('http://localhost:8000/cupom/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    porcentagem_desconto: valorPorcentagem,
                    data_vencimento: dataVencimento,
                    eventos_validos: eventosSelecionados
                })
            })

            if(!res.ok){
                setErro('Erro ao salvar cupom. Verifique a data e os campos.')
                return
            }

            navigation.navigate("Cupom")
        }catch(e){
            setErro('Não foi possivel conectar a API.')
        }finally {
            setSaving(false)
        }
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/bg_padrao.jpg')}
                style={[StyleSheet.absoluteFill, styles.image]}
                resizeMode='cover'
            />


            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/*Titulo*/}
                <View style={styles.tituloBox}>
                    <Text style={styles.titulo}>CRIAR CUPOM</Text>
                </View>

                <View style={styles.formCard}>


                    {/*Porcentagem*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Porcentagem de desconto (%):</Text>
                        </View>
                    </View>
                    <TextInput
                        value={porcentagemDesconto}
                        onChangeText={(text) => setPorcentagemDesconto(text.replace(/[^0-9]/g, ''))}
                        keyboardType="numeric"
                        style={styles.input}
                        placeholder="Ex: 1-100"
                        placeholderTextColor='#777'
                    />


                    {/*Data de vencimento*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Data de Vencimento:</Text>
                        </View>

                        <TextInput
                            value={dataVencimento}
                            onChangeText={setDataVencimento}
                            style={styles.input}
                            placeholder="AAAA-MM-DD (ex: 2026-01-01)"
                            maxLength={10}
                        />
                    </View>

                    {/*Eventos validos*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Eventos Válidos:</Text>
                        </View>
                        <View style={styles.checkboxList}>
                            {eventosValidos.map((ev) => {
                                const marcado = eventosSelecionados.includes(ev.id)
                                return(
                                    <TouchableOpacity
                                        key={ev.id}
                                        style={styles.checkboxItem}
                                        onPress={() => toggleEvento(ev.id)}
                                    >
                                        <Ionicons
                                            name={marcado ? "checkbox" : "square-outline"}
                                            size={22}
                                            color={marcado ? COR_ENTIDADE : "#444"}
                                        />
                                        <Text style={styles.checkboxLabel}>{ev.nome}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>

                    {/*Botão para envio*/}
                    <View style={styles.acoesContainer}>
                        {saving ? (
                            <ActivityIndicator size='large' color={COR_ENTIDADE}/>
                        ) : (
                            <TouchableOpacity
                                style={styles.submitButton}
                                activeOpacity={0.75}
                                onPress={handleSave}
                            >
                                <Text style={styles.submitButtonText}>SALVAR</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={styles.voltarButton}
                            activeOpacity={0.75}
                            onPress={() => navigation.navigate("Cupom")}
                        >
                            <Text>VOLTAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/*Erros*/}
                {!!erro && (
                    <View style={styles.erroBox}>
                        <Text style={styles.erroText}>{erro}</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
        alignItems: 'center'
    },
    tituloBox: {
        backgroundColor: 'white',
        borderColor: COR_ENTIDADE,
        borderWidth: 5,
        borderTopWidth: 10,
        borderBottomWidth: 0,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 24,
        zIndex: 1
    },
    titulo: {
        fontSize: 28,
        fontWeight: '900',
        color: '#111',
        textAlign: 'center',
        textShadowColor: 'rgb(117,116,116)',
        textShadowOffset: { width: 0, height: 3},
        textShadowRadius: 1
    },
    formCard: {
        width: '100%',
        backgroundColor: "rgba(216, 237, 247, 0.95)",
        borderColor: COR_ENTIDADE,
        borderWidth: 3,
        borderBottomWidth: 14,
        borderRadius: 16,
        padding: 16
    },
    campoGrupo: {
        marginBottom: 14
    },
    labelContainer: {
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.5)",
        borderStyle: "dotted",
        paddingBottom: 3,
        marginBottom: 8
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#111',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: '#111',
        minHeight: 44,
        elevation: 2
    },
    checkboxList: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 8,
        gap: 6
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.1)"
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#111',
        flex: 1
    },
    acoesContainer: {
        marginTop: 12,
        alignItems: 'center',
        gap: 10
    },
    submitButton: {
        width: 200,
        height: 50,
        backgroundColor: '#868f9f',
        borderColor: '42474e',
        borderWidth: 3,
        borderBottomWidth: 6,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitButtonText: {
        color: '#111',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 1
    },
    voltarButton: {
        paddingVertical: 8,
        paddingHorizontal: 20
    },
    erroBox: {
        marginTop: 14,
        width: '100%',
        borderWidth: 3,
        borderColor: 'red',
        backgroundColor: 'rgba(255,0,0,0.25)',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center'
    },
    erroText: {
        color: '#800000',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center'
    }
})

export default CriarCupomScreen
