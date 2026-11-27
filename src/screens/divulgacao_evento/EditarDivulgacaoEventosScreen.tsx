import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";


type Props = DrawerScreenProps<DrawerParamList, "EditarDivulgacaoEvento">

//COR PADRAO DO APP
const COR_ENTIDADE = 'rgb(145, 145, 145)'

const EditarDivulgacaoEventoScreen = ({navigation, route}: Props) => {
    
    const {divulgacao_evento} = route.params
    
    
    return null
}

export default EditarDivulgacaoEventoScreen