import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = DrawerScreenProps<DrawerParamList, 'CriarEvento'>


const CriarEventoScreen = ({navigation}: Props) => {
    
    const [nome, setNome] = useState('')
    const [descricao, setDescricao] = useState('')
    const [banner, setBanner] = useState<ImagePicker.ImagePickerAsset | null>(null)
    const [regras, setRegras] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
    const [saving, setSaving] = useState(false)


    useFocusEffect(
        useCallback(() => {
            setNome("")
            setDescricao("")
            setBanner(null)
            setRegras(null)
        }, [])
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


    /*
    
    Como o Image e File não podem ser enviados normalmente atraves de json.stringfy
    O ideal é usar o FormData que possui os mesmos parametros de forms do html
    "multipart/form-data" para imagens e arquivos
    
    */

    const handleSave = async() => {
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

            await fetch('http://localhost:8000/evento/', {
                method: 'POST',
                body: formData
            })
        
            navigation.navigate('Evento')

        }catch(e){
            console.error("Erro ao enviar formulario: ", e)
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
                    <Text style={styles.titulo}>CRIAR EVENTO</Text>
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
                            <Text style={styles.fileButtonText}>{banner ? "Trocar Banner" : "Escolher Imagem"}</Text>
                        </TouchableOpacity>
                        {banner && (
                            <Image
                                source={{uri: banner.uri}}
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
                            <Text style={styles.fileButtonText}>{regras ? "Trocar Regras" : "Escolher Regras"}</Text>
                        </TouchableOpacity>
                        {regras && (
                            <Text style={styles.fileName}>Arquivo: {regras.name}</Text>
                        )}
                    </View>

                    {/*Descricao*/}

                </View>

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
        borderColor: 'rgb(2, 109, 25)',
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
        borderColor: 'rgb(2, 109, 25)',
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
        color: 'rgb(2, 109, 25)',
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
        borderColor: 'rgb(2, 109, 25)'
    }
})

export default CriarEventoScreen