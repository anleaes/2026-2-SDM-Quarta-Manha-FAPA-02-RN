import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";

type Props = DrawerScreenProps<DrawerParamList, 'CriarEvento'>


const CriarEventoScreen = ({navigation}: Props) => {
    
    const [nome, setNome] = useState('')
    const [descricao, setDescricao] = useState('')
    const [banner, setBanner] = useState<ImagePicker.ImagePickerAsset | null>(null)
    const [regras, setRegras] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
    const [saving, setSaving] = useState(false)


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
        
        }catch(e){
            console.error("Erro ao enviar formulario: ", e)
        }finally{
            setSaving(false)
        }
    }

    return null
}

export default CriarEventoScreen