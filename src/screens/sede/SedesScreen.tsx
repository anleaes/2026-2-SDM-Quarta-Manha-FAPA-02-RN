import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

type Props = DrawerScreenProps<DrawerParamList, 'Sede'>

export type Sede = {
    id: number;
    nome: string;
    endereco: string;
    cnpj: string;
    status: string;
}

const SedesScreen = ({navigation}: Props) => {
    const [sedes, setSedes] = useState<Sede[]>([])
    const [carregamento, setCarregamento] = useState(true)

    const fetchSedes = async() => {
        setCarregamento(true)
        const response = await fetch('http://localhost:8000/sede/')
        const data = await response.json()
        setSedes(data)
        setCarregamento(false)
    }

      useFocusEffect(
        useCallback(() => {
            fetchSedes()
        }, [])
    )

     const handleDelete = async (id: number) => {
        const res = await fetch(`http://localhost:8000/sede/${id}`, {
            method: 'DELETE',
        })
        setSedes(prev => prev.filter(sede => sede.id !== id))
    }
}