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

    const handleSave = async() => {

        if(evento.length === 0){
            setErro('Selecione pelo menos um evento válido.')
            return
        }

        if(sede.length === 0){
            setErro('Selecione pelo menos um evento válido.')
            return
        }

        if(!data.trim()){
            setErro('Informe a data (AAAA-MM-DD).')
            return
        }

        if(!horarioComeco.trim()){
            setErro('Informe o horario inicial (00:00:00).')
            return
        }

        if(!horarioFim.trim()){
            setErro('Informe o horario final (00:00:00).')
            return
        }

        if(precoBase.length === 0) {
            setErro('Informe um preço')
            return
        }

        setErro('')
        setSaving(true)

        try{
            const res = await fetch('http://localhost:8000/divulgacao_evento/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    data: data,
                    horario_comeco: horarioComeco,
                    horario_fim: horarioFim,
                    preco_base: precoBase,
                    evento: evento,
                    local: sede
                })
            })

            if(!res.ok){
                setErro('Erro ao salvar divulgacao evento. Verifique os campos.')
                return
            }

            navigation.navigate("DivulgacaoEvento")
        }catch(e){
            setErro('Não foi possivel conectar a API.')
        }finally {
            setSaving(false)
        }
    }

    return null
}

export default CriarDivulgacaoEvento