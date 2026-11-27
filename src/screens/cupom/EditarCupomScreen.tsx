import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { Evento } from "../evento/EventosScreen";


type Props = DrawerScreenProps<DrawerParamList, "EditarCupom">


//COR PADRAO DO APP
const COR_ENTIDADE = 'rgb(122, 33, 240)'

const EditarCupomScreen = ({route, navigation}: Props) => {

    const {cupom} = route.params

    const [porcentagemDesconto, setPorcentagemDesconto] = useState(String(cupom.porcentagem_desconto))
    const [dataVencimento, setDataVencimento] = useState(cupom.data_vencimento)
    const [eventosValidos, setEventosValidos] = useState<Evento[]>([])
    const [eventosSelecionados, setEventosSelecionados] = useState<number[]>(cupom.eventos_validos)
    const [saving, setSaving] = useState(false)
    const [erro, setErro] = useState('')

    //Buscar na API os eventos para montar o checkbox m2m
    const fetchEventos = async() => {
        try{
            const res = await fetch('http://localhost:8000/evento/', {cache: 'no-store'})
            const data = await res.json()
            setEventosValidos(data)
        }catch(e){
            setErro('Não foi possivel carregar a lista de eventos.')
        }
    }
    
    useFocusEffect(
        useCallback(() => {
            setPorcentagemDesconto(String(cupom.porcentagem_desconto))
            setDataVencimento(cupom.data_vencimento)
            setEventosSelecionados(cupom.eventos_validos)
            setErro('')
            fetchEventos()
        }, [cupom])
    )

    const toggleEvento = (id: number) => {
        setEventosSelecionados((prev) => 
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    return null
}

const styles = StyleSheet.create({

})

export default EditarCupomScreen