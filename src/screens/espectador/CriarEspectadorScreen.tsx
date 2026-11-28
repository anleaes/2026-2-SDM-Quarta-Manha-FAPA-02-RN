import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Checkbox, Picker } from '@expo/ui';
import { Sede } from "../sede/SedesScreen";


type Props = DrawerScreenProps<DrawerParamList, 'CriarEspectador'>

//COR PADRAO DO APP
const COR_ENTIDADE = 'rgb(221, 169, 58)'

const GENEROS = [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' },
        { label: 'Outro-Não_Informado', value: 'O' },
    ];


const CriarEspectadorScreen = ({navigation}: Props) => {
    
    const [nome, setNome] = useState('')
    const [data_nascimento, setDataNascimento] = useState('') //ANO-MES-DIA
    const [telefone, setTelefone] = useState('')
    const [email, setEmail] = useState('')

    const [genero, setGenero] = useState('')
    const [sede_de_registro, setSedeRegistro] = useState(0)
    const [ads_por_email, setAds] = useState(true)


    const [sedes, setSedes] = useState<Sede[]>([])

    const [saving, setSaving] = useState(false)
    const [erro, setErro] = useState('')

    const fetchSedes = async() => {
        // setCarregamento(true)

        const data = await fetch('http://localhost:8000/sede/', { cache: 'no-store'})
        const dataSede = await data.json()
        setSedes(dataSede)

        // setCarregamento(false)
    }
    
    useFocusEffect(
        useCallback(() => {
            fetchSedes()

            setNome("")
            setDataNascimento("")
            setTelefone("")
            setEmail("")
            setGenero("")
            setSedeRegistro(0)
            setAds(true)

            setErro('')
        }, [])
    )

    const handleSave = async() => {

        if(!nome.trim()){
            setErro('O campo Nome é obrigatório.')
            return
        }
        setErro('')
        setSaving(true)

        try{
            const res = await fetch('http://localhost:8000/espectador/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome,
                    data_nascimento: data_nascimento,
                    telefone: telefone,
                    email: email,
                    genero: genero,
                    sede_de_registro: sede_de_registro,
                    ads_por_email: ads_por_email
                })
            })

            if(!res.ok){
                setErro('Erro ao salvar o espectador. Verifique os dados.')
                return
            }
        
            navigation.navigate('Espectador')

        }catch(e){
            setErro('Não foi possivel conectar ao servidor.')
        }finally{
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
                    <Text style={styles.titulo}>CRIAR ESPECTADOR</Text>
                </View>

                {/*Corpo do formulario*/}
                <View style={styles.formCard}>

                    {/*Nome*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Nome:</Text>
                        </View>
                        <TextInput
                            value={nome}
                            onChangeText={setNome}
                            style={styles.input}
                            placeholder="Digite o nome do espectador"
                            placeholderTextColor="#777"
                        />
                    </View>

                    {/* Data Nascimento */}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Data de Nascimento:</Text>
                        </View>
                        <TextInput
                            value={data_nascimento}
                            onChangeText={setDataNascimento}
                            style={styles.input}
                            placeholder="AAAA-MM--DD"
                            placeholderTextColor="#777"
                        />
                    </View>

                    {/* Telefone */}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Telefone:</Text>
                        </View>
                        <TextInput
                            value={telefone}
                            onChangeText={setTelefone}
                            style={styles.input}
                            placeholder="Digite o telefone do espectador"
                            placeholderTextColor="#777"
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Email:</Text>
                        </View>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            placeholder="Digite o email do espectador"
                            placeholderTextColor="#777"
                        />
                    </View>

                    {/*Gênero*/}
                    <View style={styles.campoGrupo}>
                        <Text> Gênero: </Text>
                        <Picker selectedValue={genero} onValueChange={setGenero}>
                            {GENEROS.map(g => (
                                <Picker.Item key={g.value} label={g.label} value={g.value} />
                            ))}
                        </Picker>
                    </View>

                    {/*Sede de Registro*/}
                    <View style={styles.campoGrupo}>
                        <Text> Sede de Registro: </Text>

                        {/* TODO: lógica de carregamento */}
                        <Picker selectedValue={sede_de_registro} onValueChange={setSedeRegistro}>
                            {sedes.map(s => (
                                <Picker.Item key={s.id} label={s.nome} value={s.id} />
                            ))}
                        </Picker>
                    </View>

                    {/* Ads por Email */}
                    <View style={styles.campoGrupo}>
                        <Checkbox label="Ads por Email" value={ads_por_email} onValueChange={setAds} />
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
                            onPress={() => navigation.navigate("Espectador")}
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

export default CriarEspectadorScreen