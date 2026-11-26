import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";

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


    return null
}

export default EditarEventoScreen