import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Picker } from '@expo/ui';

type Props = DrawerScreenProps<DrawerParamList, 'EditarSede'>


//COR PADRAO DO APP
const COR_ENTIDADE = 'rgb(133, 248, 110)'

const SEDE_STATUS = [
        { label: 'Em Funcionamento', value: 'F' },
        { label: 'Desativado', value: 'X' },
        { label: 'Em Reforma', value: 'R' },
    ];

const EditarSedeScreen = ({route, navigation}: Props) => {

    const { sede } = route.params
    
    const [nome, setNome] = useState('')
    const [endereco, setEndereco] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [status, setStatus] = useState('')

    const [saving, setSaving] = useState(false)
    const [erro, setErro] = useState('')

    

    useFocusEffect(
        useCallback(() => {
            setNome(sede.nome)
            setEndereco(sede.endereco)
            setCnpj(sede.cnpj)
            setStatus(sede.status)

            setErro('')
        }, [sede])
    )

    const handleSave = async() => {

        if(!nome.trim()){
            setErro('O campo Nome é obrigatório.')
            return
        }
        setErro('')
        setSaving(true)
        try{
            const formData = new FormData()
             
            formData.append("nome", nome)
            formData.append("endereco", endereco)
            formData.append("cnpj", cnpj)
            formData.append("status", status)

            const res = await fetch(`http://localhost:8000/sede/${sede.id}/`, {
                method: 'PATCH',
                body: formData
            })

            if(!res.ok){
                setErro('Erro ao salvar a sede. Verifique os dados.')
                return
            }
        
            navigation.navigate('Sede')

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
                    <Text style={styles.titulo}>EDITAR SEDE</Text>
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
                            placeholder="Digite o nome da sede"
                            placeholderTextColor="#777"
                        />
                    </View>

                    {/*Endereco*/}
                   <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Endereço:</Text>
                        </View>
                        <TextInput
                            value={endereco}
                            onChangeText={setEndereco}
                            style={styles.input}
                            placeholder="Digite o Endereço da Sede"
                            placeholderTextColor="#777"
                        />
                    </View>

                    {/*Cnpj*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>CNPJ:</Text>
                        </View>
                        <TextInput
                            value={cnpj}
                            onChangeText={setCnpj}
                            style={styles.input}
                            placeholder="Digite o CNPJ da Sede"
                            placeholderTextColor="#777"
                        />
                    </View>

                    {/*Status*/}
                    <View style={styles.campoGrupo}>
                        <Text> Status: </Text>
                        <Picker selectedValue={status} onValueChange={setStatus}>
                            {SEDE_STATUS.map(s => (
                                <Picker.Item key={s.value} label={s.label} value={s.value} />
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
                            onPress={() => navigation.navigate("Sede")}
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

export default EditarSedeScreen