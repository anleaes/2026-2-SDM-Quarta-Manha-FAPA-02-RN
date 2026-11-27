import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Evento } from "../evento/EventosScreen";


type Props = DrawerScreenProps<DrawerParamList, 'DivulgacaoEvento'>

export type DivulgacaoEvento = {
    id: number,
    evento: number,
    local: number,
    data: string,
    horarioComeco: string,
    horarioFim: string,
    precoBase: string
}

const COR_CUPOM = 'rgb(145, 145, 145)'
const COR_CUPOM_SEC = 'rgba(54, 54, 54, 0.151)'




const DivulgacaoEventoScreen = ({navigation}: Props) => {

    

    const [divulgacaoEvento, setDivulgacaoEvento] = useState<DivulgacaoEvento[]>([])
    const [eventos, setEventos] = useState<Evento[]>([])
    const [carregamento, setCarregamento] = useState(true)
    
    const fetchDados = async() => {
        setCarregamento(true)
        const [resDivulgacaoEvento, resEventos] = await Promise.all([
            fetch('http://localhost:8000/divulgacao_evento/', { cache: 'no-store'}),
            fetch('http://localhost:8000/evento/', { cache: 'no-store'})
        ])
        const dataDivulgacaoEvento = await resDivulgacaoEvento.json()
        const dataEvento = await resEventos.json()
        setDivulgacaoEvento(dataDivulgacaoEvento)
        setEventos(dataEvento)
        setCarregamento(false)
    }
    
    useFocusEffect(
        useCallback(() => {
            fetchDados()
        }, [])
    )
    
    const handleDelete = async (id: number) => {
        const res = await fetch(`http://localhost:8000/divulgacao_evento/${id}/`, {
            method: 'DELETE',
        })
        setDivulgacaoEvento(prev => prev.filter(cupom => cupom.id !== id))
    }

    //converter ID do evento para nome
    const getNomeEvento = (id:number) => {
        const encontrado = eventos.find((e) => e.id === id)
        return encontrado ? encontrado.nome : `Evento #${id}`
    }
    
    return null
}

export default DivulgacaoEventoScreen