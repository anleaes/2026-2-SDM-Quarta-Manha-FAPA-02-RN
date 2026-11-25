import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useState } from "react";


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
    }
}