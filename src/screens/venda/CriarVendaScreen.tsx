import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useState } from "react";
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


    return null
}

export default CriarVendaScreen
