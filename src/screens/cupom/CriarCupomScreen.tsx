import { DrawerParamList } from "@/navigation/DrawNavigator"
import { DrawerScreenProps } from "@react-navigation/drawer"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { Evento } from "../evento/EventosScreen"

type Props = DrawerScreenProps<DrawerParamList, 'CriarCupom'>

//COR PADRAO DO APP
const COR_ENTIDADE = 'rgb(122, 33, 240)'


const CriarCupomScreen = ({navigation}: Props) => {

    const [porcentagemDesconto, setPorcentagemDesconto] = useState('1')
    const [dataVencimento, setDataVencimento] = useState('')
    //Buscar os eventos validos para o cupom
    const [eventosValidos, setEventosValidos] = useState<Evento[]>([])
    const [eventosSelecionados, setEventosSelecionados] = useState<number[]>([])
    const [saving, setSaving] = useState(false)
    const [erro, setErro] = useState('')



    //Buscar na API os eventos para montar o checkbox m2m
    const fetchEventos = async() => {
        try{
            const res = await fetch('http://localhost:8000/evento/')
            const data = await res.json()
            setEventosValidos(data)
        }catch(e){
            setErro('Não foi possivel carregar a lista de eventos.')
        }
    }

    useFocusEffect(
        useCallback(() => {
            setPorcentagemDesconto('1')
            setDataVencimento('')
            setEventosSelecionados([])
            setErro('')
            fetchEventos()
        }, [])
    )

    //Marcar e Desmarcar o ID do evento no array
    const toggleEvento = (id: number) => {
        setEventosSelecionados((prev) => 
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    return null
}


export default CriarCupomScreen
