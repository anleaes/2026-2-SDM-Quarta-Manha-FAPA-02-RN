import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";


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
    return null
}

export default VendasScreen