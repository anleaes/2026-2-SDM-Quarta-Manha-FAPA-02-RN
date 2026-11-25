import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import Ionicons from "@react-native-vector-icons/ionicons";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

    const renderItem = ({item}: {item: Sede}) => {
        <View>
        </View>
    }


    return (
        <View style={styles.container}>
            <Text>Sedes</Text>
            {carregamento ? (
                <ActivityIndicator size="large" color="rgb(2, 109, 25)"/>
            ) : (
                <FlatList
                    data={sedes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle = {{paddingBottom: 20}}
                />
            )}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {}}
            >
                <Ionicons name="add" size={28} color="#fff"/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingTop: 16
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: 'rgb(2, 109, 25)',
        borderRadius: 28,
        padding: 14,
        elevation: 4
    }
})