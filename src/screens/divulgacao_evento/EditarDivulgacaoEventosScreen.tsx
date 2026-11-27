import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Evento } from "../evento/EventosScreen";
import { Sede } from "../sede/SedesScreen";


type Props = DrawerScreenProps<DrawerParamList, "EditarDivulgacaoEvento">

//COR PADRAO DO APP
const COR_ENTIDADE = 'rgb(145, 145, 145)'

const EditarDivulgacaoEventoScreen = ({navigation, route}: Props) => {
    
    const {divulgacao_evento} = route.params
    
    
    const [eventos, setEvento] = useState<Evento[]>([])
    const [sedes, setSede] = useState<Sede[]>([])
    const [eventoId, setEventoId] = useState(divulgacao_evento.evento)
    const [sedeId, setSedeId] = useState(divulgacao_evento.local)
    const [data, setData] = useState(divulgacao_evento.data)
    const [horarioComeco,setHorarioComeco] = useState(divulgacao_evento.horario_comeco)
    const [horarioFim,setHorarioFim] = useState(divulgacao_evento.horario_fim)
    const [precoBase, setPrecoBase] = useState(divulgacao_evento.preco_base)
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
            setEventoId(divulgacao_evento.evento)
            setSedeId(divulgacao_evento.local)
            setData(divulgacao_evento.data)
            setHorarioComeco(divulgacao_evento.horario_comeco)
            setHorarioFim(divulgacao_evento.horario_fim)
            setPrecoBase(divulgacao_evento.preco_base)
            setErro('')
            fetchForeigns()
        }, [divulgacao_evento])
    )


    return null
}

export default EditarDivulgacaoEventoScreen