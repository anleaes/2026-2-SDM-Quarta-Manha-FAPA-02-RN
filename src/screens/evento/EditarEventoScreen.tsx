import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

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

    return null
}

export default EditarEventoScreen