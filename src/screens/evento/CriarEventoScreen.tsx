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

    return null
}

export default CriarEventoScreen