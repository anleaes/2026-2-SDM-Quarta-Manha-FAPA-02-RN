import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Espectador } from "../espectador/EspectadoresScreen";
import { Funcionario } from "../funcionario/FuncionariosScreen";


type Props = DrawerScreenProps<DrawerParamList, "Venda">

export type Venda = {
    id: number,
    funcionario: number,
    pagador: number,
    preco_total: string,
    ultima_edicao: string,
    status: string
}

const COR_CUPOM = 'rgb(199, 216, 50)'
const COR_CUPOM_SEC = 'rgba(255, 255, 0, 0.151)'

const VendasScreen = ({navigation}: Props) => {
    
    const [venda, setVenda] = useState<Venda[]>([])
    const [funcionario, setFuncionario] = useState<Funcionario[]>([])
    const [pagador, setPagador] = useState<Espectador[]>([])
    const [carregamento, setCarregamento] = useState(true)

    const fetchDados = async() => {
        setCarregamento(true)
        const [resVenda, resFuncionario, resEspectador] = await Promise.all([
            fetch('http://localhost:8000/venda/', { cache: 'no-store'}),
            fetch('http://localhost:8000/funcionario/', { cache: 'no-store'}),
            fetch('http://localhost:8000/espectador/', { cache: 'no-store'})
        ])
        const dataVenda = await resVenda.json()
        const dataFuncionario = await resFuncionario.json()
        const dataEspectador = await resEspectador.json()
        setVenda(dataVenda)
        setFuncionario(dataFuncionario)
        setPagador(dataEspectador)
        setCarregamento(false)
    }

    useFocusEffect(
        useCallback(() => {
            fetchDados()
        }, [])
    )

    const handleDelete = async (id: number) => {
        const res = await fetch(`http://localhost:8000/venda/${id}/`, {
            method: 'DELETE',
        })
        setVenda(prev => prev.filter(venda => venda.id !== id))
    }

    //converter ID do funcionario para nome
    const getNomeFuncionario = (id:number) => {
        const encontrado = funcionario.find((f) => f.id === id)
        return encontrado ? encontrado.nome : `Funcionario #${id}`
    }
    
    //converter ID do espectador para nome
    const getNomePagador = (id:number) => {
        const encontrado = pagador.find((p) => p.id === id)
        return encontrado ? encontrado.nome : `Pagador #${id}`
    }

    return null
}

export default VendasScreen