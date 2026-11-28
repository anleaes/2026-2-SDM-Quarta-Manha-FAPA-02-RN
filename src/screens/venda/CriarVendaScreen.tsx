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
    const [eventoId, setEventoId] = useState(0)
    const [sedeId, setSedeId] = useState(0)
    const [status, setStatus] = useState('')
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
            setEventoId(0)
            setSedeId(0)
            setStatus('')
            setErro('')
            fetchForeigns()
        }, [])
    )

    return null
}

export default CriarVendaScreen
