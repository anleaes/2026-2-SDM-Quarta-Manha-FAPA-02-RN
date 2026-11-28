import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useState } from "react";
import { Espectador } from "../espectador/EspectadoresScreen";
import { Funcionario } from "../funcionario/FuncionariosScreen";


type Props = DrawerScreenProps<DrawerParamList, "EditarVenda">

const COR_APP = 'rgb(199, 216, 50)'

const STATUS = [
    { label: 'Andamento', value: 'A' },
    { label: 'Cancelado', value: 'CA' },
    { label: 'Outro-Concluido', value: 'CO' },
];

const EditarVendaScreen = ({navigation, route}: Props) => {

    const { venda } = route.params
    
    const [funcionario, setFuncionario] = useState<Funcionario[]>([])
    const [pagador, setPagador] = useState<Espectador[]>([])
    const [funcionarioId, setFuncionarioId] = useState(venda.funcionario)
    const [pagadorId, setPagadorId] = useState(venda.pagador)
    const [status, setStatus] = useState(venda.status)
    const [saving, setSaving] = useState(false)
    const [erro, setErro] = useState('')



    return null
}

export default EditarVendaScreen