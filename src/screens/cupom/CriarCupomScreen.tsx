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


    const handleSave = async() => {
        const valorPorcentagem = parseInt(porcentagemDesconto, 10) // base 10

        if(isNaN(valorPorcentagem) || valorPorcentagem < 1 || valorPorcentagem > 100){
            setErro('A porcentagem de desconto deve ser no minimo 1 até 100.')
            return
        }

        if(!dataVencimento.trim()){
            setErro('Informe a data de vencimento (AAAA-MM-DD).')
            return
        }

        if(eventosSelecionados.length === 0){
            setErro('Selecione pelo menos um evento válido.')
            return
        }

        setErro('')
        setSaving(true)

        try{
            const res = await fetch('http:localhost:8000/cupom/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    porcentagem_desconto: valorPorcentagem,
                    data_vencimento: dataVencimento,
                    eventos_validos: eventosSelecionados
                })
            })

            if(!res.ok){
                setErro('Erro ao salvar cupom. Verifique a data e os campos.')
                return
            }

            navigation.navigate("Cupom")
        }catch(e){
            setErro('Não foi possivel conectar a API.')
        }finally {
            setSaving(false)
        }
    }

    return null
}


export default CriarCupomScreen
