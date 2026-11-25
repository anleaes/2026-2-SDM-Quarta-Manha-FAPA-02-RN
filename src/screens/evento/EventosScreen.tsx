import { DrawerParamList } from "@/navigation/DrawNavigator";
import Ionicons from "@react-native-vector-icons/ionicons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type Props = DrawerScreenProps<DrawerParamList, 'Evento'>

export type Evento = {
    id: number;
    nome: string;
    descricao: string;
    banner: string;
    regras: string;
}

const EventosScreen = ({navigation}: Props) => {
    const [eventos, setEventos] = useState<Evento[]>([])
    const [carregamento, setCarregamento] = useState(true)

    const fetchEventos = async() => {
        setCarregamento(true)
        const response = await fetch('http://localhost:8000/evento/')
        const data = await response.json()
        setEventos(data)
        setCarregamento(false)
    }

    useFocusEffect(
        useCallback(() => {
            fetchEventos()
        }, [])
    )


    const handleDelete = async (id: number) => {
        const res = await fetch(`http://localhost:8000/evento/${id}`, {
            method: 'DELETE',
        })
        setEventos(prev => prev.filter(evento => evento.id !== id))
    }

    const renderItem = ({item}: {item: Evento}) => (
        <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.descricao}>{item.descricao}</Text>
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => {} /*navigation.navigate('EditCategory', {evento: item})*/}
            >
                <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
            >
                <Text style={styles.editText}>Deletar</Text>
            </TouchableOpacity>
        </View>
    )


    return (
        <View style={styles.container}>
            <Text>Eventos</Text>
            {carregamento ? (
                <ActivityIndicator size="large" color="rgb(2, 109, 25)"/>
            ) : (
                <FlatList
                    data={eventos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle = {{paddingBottom: 20}}
                />
            )}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {} /*navigation.navigate('CriarEvento')*/}
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
    card: {
        backgroundColor: '#f0f4ff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 4
    },
    nome: {
        fontSize: 18,
        fontWeight: '600',
        color: '#222',
    },
    descricao: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    editButton: {
        backgroundColor: 'rgb(2, 109, 25)',
        padding: 8,
        borderRadius: 6,
        marginRight: 8
    },
    editText: {
        color: '#fff',
        fontWeight: '500'
    },
    deleteButton: {
        backgroundColor: '#E54848',
        padding: 8,
        borderRadius: 6,
        marginRight: 8,
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

export default EventosScreen