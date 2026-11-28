import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Espectador } from "../espectador/EspectadoresScreen";
import { Funcionario } from "../funcionario/FuncionariosScreen";


type Props = DrawerScreenProps<DrawerParamList, "CriarVenda">

//COR PADRAO DO APP
const COR_APP = 'rgb(199, 216, 50)'

const STATUS = [
    { label: 'Andamento', value: 'A' },
    { label: 'Cancelado', value: 'CA' },
    { label: 'Outro-Concluido', value: 'CO' },
];


const CriarVendaScreen = ({navigation}: Props) => {



    const [funcionario, setFuncionario] = useState<Funcionario[]>([])
    const [pagador, setPagador] = useState<Espectador[]>([])
    const [funcionarioId, setFuncionarioId] = useState(0)
    const [pagadorId, setPagadorId] = useState(0)
    const [status, setStatus] = useState('A')
    const [saving, setSaving] = useState(false)
    const [erro, setErro] = useState('')

    const fetchForeigns = async() => {
        try{
            const [resFuncionario, resEspectador] = await Promise.all([
                fetch('http://localhost:8000/funcionario/'),
                fetch('http://localhost:8000/espectador/')
            ])
            const dataFuncionario = await resFuncionario.json()
            const dataEspectador = await resEspectador.json()

            setFuncionario(dataFuncionario)
            setPagador(dataEspectador)

        }catch(e){
            setErro('Não foi possivel carregar as foreigns datas.')
        }
    }

    useFocusEffect(
        useCallback(() => {
            setFuncionarioId(0)
            setPagadorId(0)
            setStatus('A')
            setErro('')
            fetchForeigns()
        }, [])
    )

    const handleSave = async() => {

        if(!funcionarioId){
            setErro('Selecione pelo menos um funcionario válido.')
            return
        }

        if(!pagadorId){
            setErro('Selecione pelo menos um pagador válido.')
            return
        }

        if(!status.trim()) {
            setErro('Informe um preço')
            return
        }

        setErro('')
        setSaving(true)

        try{
            const res = await fetch('http://localhost:8000/venda/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    funcionario: funcionarioId,
                    pagador: pagadorId,
                    status: status
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

export default CriarVendaScreen
