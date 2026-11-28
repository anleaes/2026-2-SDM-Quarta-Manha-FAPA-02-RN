import { DrawerParamList } from "@/navigation/DrawNavigator";
import { Picker } from "@expo/ui";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Espectador } from "../espectador/EspectadoresScreen";
import { Funcionario } from "../funcionario/FuncionariosScreen";


type Props = DrawerScreenProps<DrawerParamList, "CriarVenda">

//COR PADRAO DO APP
const COR_ENTIDADE = 'rgb(199, 216, 50)'

const STATUS = [
    { label: 'Andamento', value: 'A' },
    { label: 'Cancelado', value: 'CA' },
    { label: 'Outro-Concluido', value: 'CO' },
];


const CriarVendaScreen = ({navigation}: Props) => {



    const [funcionario, setFuncionario] = useState<Funcionario[]>([])
    const [pagador, setPagador] = useState<Espectador[]>([])
    const [funcionarioId, setFuncionarioId] = useState(0)
    const [pagadorId, setPagadorId] = useState(0)
    const [status, setStatus] = useState('A')
    const [saving, setSaving] = useState(false)
    const [erro, setErro] = useState('')

    const fetchForeigns = async() => {
        try{
            const [resFuncionario, resEspectador] = await Promise.all([
                fetch('http://localhost:8000/funcionario/'),
                fetch('http://localhost:8000/espectador/')
            ])
            const dataFuncionario = await resFuncionario.json()
            const dataEspectador = await resEspectador.json()

            setFuncionario(dataFuncionario)
            setPagador(dataEspectador)

        }catch(e){
            setErro('Não foi possivel carregar as foreigns datas.')
        }
    }

    useFocusEffect(
        useCallback(() => {
            setFuncionarioId(0)
            setPagadorId(0)
            setStatus('A')
            setErro('')
            fetchForeigns()
        }, [])
    )

    const handleSave = async() => {

        if(!funcionarioId){
            setErro('Selecione pelo menos um funcionario válido.')
            return
        }

        if(!pagadorId){
            setErro('Selecione pelo menos um pagador válido.')
            return
        }

        if(!status.trim()) {
            setErro('Informe um status')
            return
        }

        setErro('')
        setSaving(true)

        try{
            const res = await fetch('http://localhost:8000/venda/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    funcionario: funcionarioId,
                    pagador: pagadorId,
                    status: status
                })
            })

            if(!res.ok){
                setErro('Erro ao salvar divulgacao evento. Verifique os campos.')
                return
            }

            navigation.navigate("Venda")
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
                    <Text style={styles.titulo}>CRIAR VENDA</Text>
                </View>

                <View style={styles.formCard}>


                    {/*Funcionario*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}> Funcionario: </Text>
                        </View>
                    
                        <Picker  selectedValue={funcionarioId} onValueChange={setFuncionarioId}>
                            <Picker.Item label="Selecione um funcionario" value={0} />
                            {funcionario.map((f) => (
                                <Picker.Item key={f.id} label={f.nome} value={f.id}/>
                            ))}
                        </Picker>
                    </View>
                    
                    {/*Pagador*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}> Pagador: </Text>
                        </View>

                        <Picker selectedValue={pagadorId} onValueChange={setPagadorId}>
                            <Picker.Item label="Selecione uma sede" value={0} />
                            {pagador.map((p) => (
                                <Picker.Item key={p.id} label={p.nome} value={p.id}/>
                            ))}
                        </Picker>
                    </View>

                    {/*Status*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}> Status: </Text>
                        </View>

                        <Picker selectedValue={pagadorId} onValueChange={setPagadorId}>
                            {STATUS.map((s) => (
                                <Picker.Item key={s.value} label={s.label} value={s.value}/>
                            ))}
                        </Picker>
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
                            onPress={() => navigation.navigate('Venda')}
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

export default CriarVendaScreen
