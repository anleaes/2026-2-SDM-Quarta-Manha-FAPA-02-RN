import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";


type Props = DrawerScreenProps<DrawerParamList, 'Cupom'>

export type Cupom = {
    id: number,
    porcentagem_desconto: number,
    data_vencimento: string,
    eventos_validos: number[]
}

const COR_CUPOM = 'rgb(122, 33, 240)'

const CuponsScreen = ({navigation}: Props) => {


    return null
}

const styles = StyleSheet.create({
    
})

export default CuponsScreen