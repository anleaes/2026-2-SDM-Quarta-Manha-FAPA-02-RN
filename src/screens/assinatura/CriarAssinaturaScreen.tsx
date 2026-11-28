import { DrawerParamList } from "@/navigation/DrawNavigator";
import Ionicons from "@react-native-vector-icons/ionicons"
import { DrawerScreenProps } from "@react-navigation/drawer";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Beneficio } from "../beneficio/BeneficiosScreen";
import { validatePathConfig } from "@react-navigation/native";

type Props = DrawerScreenProps<DrawerParamList, 'CriarAssinatura'>

//COR PADRAO DO APP
const COR_ENTIDADE = 'rgb(207, 67, 67)'

const CriarAssinaturaScreen = ({navigation}: Props) => {
    
    const [icone, setIcone] = useState<ImagePicker.ImagePickerAsset | null>(null)
    const [nome, setNome] = useState('')
    const [descricao, setDescricao] = useState('')
    const [custo_mensal, setCustoMensal] = useState('')
    
    const [beneficiosGeral, setBeneficiosGeral] = useState<Beneficio[]>([])
    const [beneficiosSelecionados, setBeneficiosSelecionados] = useState<number[]>([])

    const [saving, setSaving] = useState(false)
    const [erro, setErro] = useState('')

    //Buscar na API os eventos para montar o checkbox m2m
    const fetchBeneficios = async() => {
        try{
            const res = await fetch('http://localhost:8000/beneficio/')
            const data = await res.json()
            setBeneficiosGeral(data)
        }catch(e){
            setErro('Não foi possivel carregar a lista de beneficios.')
        }
    }


    useFocusEffect(
        useCallback(() => {
            setIcone(null)
            setNome("")
            setDescricao("")
            setCustoMensal("")
            setBeneficiosSelecionados([])
            setErro('')
            fetchBeneficios()
        }, [])
    )

    //Marcar e Desmarcar o ID do beneficio no array
    const toggleBeneficio = (id: number) => {
        setBeneficiosSelecionados((prev) => 
            //Se tinha o beneficioID da lista, removê-lo, senão, recriar lista com ele agora incluído
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

   
    //ImageField
    const escolherIcone = async() => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8
        })
        if(!result.canceled){
            setIcone(result.assets[0])
        }
    }

    const handleSave = async() => {

        if(!nome.trim()){
            setErro('O campo Nome é obrigatório.')
            return
        }

        if(beneficiosSelecionados.length === 0){
            setErro('Selecione pelo menos um benefício.')
            return
        }

        setErro('')
        setSaving(true)
        try{
            const formData = new FormData()
            
            formData.append("nome", nome.trim())
            formData.append("descricao", descricao.trim())
            formData.append("custo_mensal", custo_mensal.trim())

            //necessário inserir individualmente porque senão o formData converte os itens do array pra string
            //gerando erro de tipagem ao ser processado pelo django
            beneficiosSelecionados.forEach( (benID) => { 
                formData.append("beneficios", String(benID))
            })

            if(icone){
                if(icone.file){
                    formData.append("icone", icone.file)
                }else{
                    formData.append("icone", {
                        uri: icone.uri,
                        name: icone.fileName || "icone.jpg",
                        type: icone.mimeType || "image/jpeg"
                    } as any)
                }
            }

            const res = await fetch('http://localhost:8000/assinatura/', {
                method: 'POST',
                body: formData
            })

            if(!res.ok){
                setErro('Erro ao salvar a assinatura. Verifique os dados.')
                return
            }
        
            navigation.navigate('Assinatura')

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
                    <Text style={styles.titulo}>CRIAR ASSINATURA</Text>
                </View>

                {/*Corpo do formulario*/}
                <View style={styles.formCard}>

                    
                    {/*Icone*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Ícone(Imagem): </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.fileButton}
                            onPress={escolherIcone}
                        >
                            <Text style={styles.fileButtonText}>{icone ? "Trocar Icone" : "Escolher Imagem"}</Text>
                        </TouchableOpacity>
                        {icone && (
                            <Image
                                source={{uri: icone.uri}}
                                style={styles.preview}
                                resizeMode="cover"
                            />
                        )}
                    </View>

                    {/*Nome*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Nome:</Text>
                        </View>
                        <TextInput
                            value={nome}
                            onChangeText={setNome}
                            style={styles.input}
                            placeholder="Digite o nome da Assinatura"
                            placeholderTextColor="#777"
                        />
                    </View>


                    {/*Descricao*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Descrição: </Text>
                        </View>
                        <TextInput
                            value={descricao}
                            onChangeText={setDescricao}
                            style={[styles.input, styles.textArea]}
                            multiline
                            textAlignVertical="top"
                            placeholder="Descreva a assinatura"
                            placeholderTextColor='#777'
                        />
                    </View>

                    {/*Custo Mensal*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Custo Mensal: </Text>
                        </View>
                        <TextInput
                            value={custo_mensal}
                            onChangeText={setCustoMensal}
                            style={[styles.input, styles.textArea]}
                            multiline
                            textAlignVertical="top"
                            placeholder="1.0"
                            placeholderTextColor='#777'
                        />
                    </View>

                    {/*Beneficios*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Benefícios:</Text>
                        </View>
                        <View style={styles.checkboxList}>
                            {beneficiosGeral.map((bn) => {
                                const marcado = beneficiosSelecionados.includes(bn.id)
                                return(
                                    <TouchableOpacity
                                        key={bn.id}
                                        style={styles.checkboxItem}
                                        onPress={() => toggleBeneficio(bn.id)}
                                    >
                                        <Ionicons
                                            name={marcado ? "checkbox" : "square-outline"}
                                            size={22}
                                            color={marcado ? COR_ENTIDADE : "#444"}
                                        />
                                        <Text style={styles.checkboxLabel}>{bn.nome}</Text>
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
                            onPress={() => navigation.navigate("Assinatura")}
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
    textArea: {
        minHeight: 100
    },
    fileButton:{
        backgroundColor: '#fff',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: '#111',
        minHeight: 44,
        elevation: 2
    },
    fileButtonText: {
        color: COR_ENTIDADE,
        fontWeight: 'bold',
        fontSize: 14
    },
    fileName: {
        marginTop: 6,
        fontSize: 13,
        color: '#222',
        fontStyle: 'italic'
    },
    preview: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 2,
        borderColor: COR_ENTIDADE
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

export default CriarAssinaturaScreen