import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { Evento } from "../evento/EventosScreen";


type Props = DrawerScreenProps<DrawerParamList, 'Cupom'>

export type Cupom = {
    id: number,
    porcentagem_desconto: number,
    data_vencimento: string,
    eventos_validos: number[]
}

const COR_CUPOM = 'rgb(122, 33, 240)'

const CuponsScreen = ({navigation}: Props) => {


    const [cupons, setCupons] = useState<Cupom[]>([])
    const [eventos, setEventos] = useState<Evento[]>([])
    const [carregamento, setCarregamento] = useState(true)


    const fetchDados = async() => {
        setCarregamento(true)
        const [resCupons, resEventos] = await Promise.all([
            fetch('http://localhost:8000/cupom/', { cache: 'no-store'}),
            fetch('http://localhost:8000/evento/', { cache: 'no-store'})
        ])
        const dataCupom = await resCupons.json()
        const dataEvento = await resEventos.json()
        setEventos(dataCupom)
        setEventos(dataEvento)
        setCarregamento(false)
    }

    useFocusEffect(
        useCallback(() => {
            fetchDados()
        }, [])
    )


    return null
}

const styles = StyleSheet.create({
    
})

export default CuponsScreen