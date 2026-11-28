import { DrawerParamList } from "@/navigation/DrawNavigator";
import { Picker } from "@expo/ui";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Evento } from "../evento/EventosScreen";
import { Sede } from "../sede/SedesScreen";


type Props = DrawerScreenProps<DrawerParamList, "CriarDivulgacaoEvento">

//COR PADRAO DO APP
const COR_ENTIDADE = 'rgb(145, 145, 145)'



const CriarDivulgacaoEvento = ({navigation}: Props) => {
    
    const [eventos, setEvento] = useState<Evento[]>([])
    const [sedes, setSede] = useState<Sede[]>([])
    const [eventoId, setEventoId] = useState(0)
    const [sedeId, setSedeId] = useState(0)
    const [data, setData] = useState('')
    const [horarioComeco,setHorarioComeco] = useState('')
    const [horarioFim,setHorarioFim] = useState('')
    const [precoBase, setPrecoBase] = useState('')
    const [saving, setSaving] = useState(false)
    const [erro, setErro] = useState('')

    const fetchForeigns = async() => {
        try{
            const [resEvento, resSede] = await Promise.all([
                fetch('http://localhost:8000/evento/'),
                fetch('http://localhost:8000/sede/')
            ])
            const dataEvento = await resEvento.json()
            const dataSede = await resSede.json()

            setEvento(dataEvento)
            setSede(dataSede)

        }catch(e){
            setErro('Não foi possivel carregar as foreigns datas.')
        }
    }

    useFocusEffect(
        useCallback(() => {
            setEventoId(0)
            setSedeId(0)
            setData('')
            setHorarioComeco('')
            setHorarioFim('')
            setPrecoBase('')
            setErro('')
            fetchForeigns()
        }, [])
    )

    const handleSave = async() => {

        if(!eventoId){
            setErro('Selecione pelo menos um evento válido.')
            return
        }

        if(!sedeId){
            setErro('Selecione pelo menos um evento válido.')
            return
        }

        if(!data.trim()){
            setErro('Informe a data (AAAA-MM-DD).')
            return
        }

        if(!horarioComeco.trim()){
            setErro('Informe o horario inicial (00:00:00).')
            return
        }

        if(!horarioFim.trim()){
            setErro('Informe o horario final (00:00:00).')
            return
        }

        if(!precoBase.trim()) {
            setErro('Informe um preço')
            return
        }

        setErro('')
        setSaving(true)

        try{
            const res = await fetch('http://localhost:8000/divulgacao_evento/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    data: data,
                    horario_comeco: horarioComeco,
                    horario_fim: horarioFim,
                    preco_base: precoBase.replace(',', '.'),
                    evento: eventoId,
                    local: sedeId
                })
            })

            if(!res.ok){
                setErro('Erro ao salvar divulgacao evento. Verifique os campos.')
                return
            }

            navigation.navigate("DivulgacaoEvento")
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
                    <Text style={styles.titulo}>CRIAR DIVULGAÇÃO EVENTO</Text>
                </View>

                <View style={styles.formCard}>


                    {/*Evento*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}> Evento: </Text>
                        </View>
                    
                        <Picker  selectedValue={eventoId} onValueChange={setEventoId}>
                            <Picker.Item label="Selecione um evento" value={0} />
                            {eventos.map((e) => (
                                <Picker.Item key={e.id} label={e.nome} value={e.id}/>
                            ))}
                        </Picker>
                    </View>
                    
                    {/*Sede*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}> Sede: </Text>
                        </View>

                        <Picker selectedValue={sedeId} onValueChange={setSedeId}>
                            <Picker.Item label="Selecione uma sede" value={0} />
                            {sedes.map((s) => (
                                <Picker.Item key={s.id} label={s.nome} value={s.id}/>
                            ))}
                        </Picker>
                    </View>

                    {/*Data*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Data:</Text>
                        </View>

                        <TextInput
                            value={data}
                            onChangeText={setData}
                            style={styles.input}
                            placeholder="AAAA-MM-DD (ex: 2026-01-01)"
                            maxLength={10}
                        />
                    </View>

                    {/*Horario Comeco*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Horario de Inicio:</Text>
                        </View>

                        <TextInput
                            value={horarioComeco}
                            onChangeText={setHorarioComeco}
                            style={styles.input}
                            placeholder="HH-MM-SS (ex: 11:42:01)"
                            maxLength={8}
                        />
                    </View>

                    {/*Horario Fim*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Horario de Termino:</Text>
                        </View>

                        <TextInput
                            value={horarioFim}
                            onChangeText={setHorarioFim}
                            style={styles.input}
                            placeholder="HH-MM-SS (ex: 11:42:01)"
                            maxLength={8}
                        />
                    </View>

                    {/*Preco Base*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Preço Base:</Text>
                        </View>

                        <TextInput
                            value={precoBase}
                            onChangeText={setPrecoBase}
                            keyboardType="decimal-pad"
                            style={styles.input}
                            placeholder="Ex: 22.00"
                            maxLength={8}
                        />
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
                            onPress={() => navigation.navigate('DivulgacaoEvento')}
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

export default CriarDivulgacaoEvento