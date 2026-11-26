import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = DrawerScreenProps<DrawerParamList, "EditarEvento">

//COR PADRAO DO APP
const COR_ENTIDADE = 'rgb(2, 109, 25)'

const EditarEventoScreen = ({route, navigation}: Props) => {
    
    const { evento } = route.params

    const [nome, setNome] = useState(evento.nome)
    const [descricao, setDescricao] = useState('')
    const [banner, setBanner] = useState<ImagePicker.ImagePickerAsset | null>(null)
    const [regras, setRegras] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
    const [saving, setSaving] = useState(false)
    const [erro, setErro] = useState('')

    useFocusEffect(
        useCallback(() => {
            setNome(evento.nome)
            setDescricao(evento.descricao)
            setBanner(null)
            setRegras(null)
            setErro('')
        }, [evento])
    )

    //ImageField
    const escolherBanner = async() => {
        //pega a imagem do mobile (precisa de permissão)
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8
        })
        if(!result.canceled){
            setBanner(result.assets[0])
        }
    }
    //FileField
    const escolherRegras = async() => {
        //pega documento explicitamente pdf
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf'
        })

        if(!result.canceled) {
            setRegras(result.assets[0])
        }
    }

    const handleSave = async() => {

        if(!nome.trim()){
            setErro('O campo Nome é obrigatório.')
            return
        }
        setErro('')
        setSaving(true)
        try{
            const formData = new FormData()
            
            //alocar nome e descricao    
            formData.append("nome", nome)
            formData.append("descricao", descricao)

            //alocar banner
            if(banner){
                if(banner.file){
                    formData.append("banner", banner.file)
                }else{
                    formData.append("banner", {
                        uri: banner.uri,
                        name: banner.fileName || "banner.jpg",
                        type: banner.mimeType || "image/jpeg"
                    } as any)
                }
            }
        
            //alocar regras
            if(regras){
                if(regras.file){
                    formData.append("regras", regras.file)
                }else{
                    formData.append("regras", {
                        uri: regras.uri,
                        name: regras.name || "regras.pdf",
                        type: regras.mimeType || "application/pdf"
                    } as any)
                }
            }

            //verificacao de erros

            //PATCH para alterar apenas os dados alterados, ao inves do PUT que atualiza todos


            const res = await fetch(`http://localhost:8000/evento/${evento.id}/`, {
                method: 'PATCH',
                body: formData
            })

            if(!res.ok){
                setErro('Erro ao salvar o evento. Verifique os dados.')
                return
            }
        
            navigation.navigate('Evento')

        }catch(e){
            setErro('Não foi possivel conectar ao servidor.')
        }finally{
            setSaving(false)
        }
    }

    //uri caso usuario não tenha escolhido um banner novo
    const bannerAtualUri = evento.banner 
        ? evento.banner.startsWith('http')
            ? evento.banner 
            : `http://localhost:8000${evento.banner}`
        : null

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
                    <Text style={styles.titulo}>EDITAR EVENTO</Text>
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
                            placeholder="Digite o nome do evento"
                            placeholderTextColor="#777"
                        />
                    </View>
                    {/*Banner*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Banner(Imagem): </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.fileButton}
                            onPress={escolherBanner}
                        >
                            <Text style={styles.fileButtonText}>{banner || bannerAtualUri ? "Trocar Banner" : "Escolher Imagem"}</Text>
                        </TouchableOpacity>
                        {(banner?.uri || bannerAtualUri) && (
                            <Image
                                source={{uri: banner ? banner.uri : bannerAtualUri!}}
                                style={styles.preview}
                                resizeMode="cover"
                            />
                        )}
                    </View>
                    {/*Regras*/}
                    <View style={styles.campoGrupo}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Regras(PDF): </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.fileButton}
                            onPress={escolherRegras}
                        >
                            <Text style={styles.fileButtonText}>{regras || evento.regras ? "Trocar Regras" : "Escolher Regras"}</Text>
                        </TouchableOpacity>
                        {regras ? (
                            <Text style={styles.fileName}>Novo Arquivo: {regras.name}</Text>
                        ) : evento.regras ? (
                            <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                                Atual: {evento.regras}
                            </Text>
                        ) : null}
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
                            placeholder="Descreva o evento"
                            placeholderTextColor='#777'
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
                            onPress={() => navigation.navigate("Evento")}
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

export default EditarEventoScreen