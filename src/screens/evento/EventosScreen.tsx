import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";


type Props = DrawerScreenProps<DrawerParamList, 'Evento'>

export type Evento = {
    id: number;
    nome: string;
    descricao: string;
    banner: string;
    regras: string;
}

const EventosScreen = ({navigation}: Props) => {
    const [eventos, setEventos] = useState<Evento[]>([])
    const [carregamento, setCarregamento] = useState(true)

    const fetchEventos = async() => {
        setCarregamento(true)
        const response = await fetch('http://localhost:8000/evento/')
        const data = await response.json()
        setEventos(data)
        setCarregamento(false)
    }

    useFocusEffect(
        useCallback(() => {
            fetchEventos()
        }, [])
    )


    const handleDelete = async (id: number) => {
        const res = await fetch(`http://localhost:8000/evento/${id}`, {
            method: 'DELETE',
        })
        setEventos(prev => prev.filter(evento => evento.id !== id))
    }

    

}


