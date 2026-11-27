import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Evento } from "../evento/EventosScreen";
import { Sede } from "../sede/SedesScreen";


type Props = DrawerScreenProps<DrawerParamList, "CriarDivulgacaoEvento">

//COR PADRAO DO APP
const COR_ENTIDADE = 'rgb(145, 145, 145)'



const CriarDivulgacaoEvento = ({navigation}: Props) => {
    
    const [evento, setEvento] = useState<Evento[]>([])
    const [sede, setSede] = useState<Sede[]>([])
    const [data, setData] = useState('')
    const [horarioComeco,setHorarioComeco] = useState('')
    const [horarioFim,setHorarioFim] = useState('')
    const [precoBase, setPrecoBase] = useState('')
    const [saving, setSaving] = useState(false)
    const [erro, setErro] = useState('')

    const fetchForeigns = async() => {
        try{
            const [resEvento, resSede] = await Promise.all([
                fetch('http://localhost:8000/evento/'),
                fetch('http://localhost:8000/sede/')
            ])
            const dataEvento = await resEvento.json()
            const dataSede = await resSede.json()

            setEvento(dataEvento)
            setSede(dataSede)

        }catch(e){
            setErro('Não foi possivel carregar as foreigns datas.')
        }
    }

    useFocusEffect(
        useCallback(() => {
            setEvento([])
            setSede([])
            setData('')
            setHorarioComeco('')
            setHorarioFim('')
            setPrecoBase('')
            setErro('')
            fetchForeigns()
        }, [])
    )

    return null
}

export default CriarDivulgacaoEvento