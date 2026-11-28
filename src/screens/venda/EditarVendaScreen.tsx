import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";


type Props = DrawerScreenProps<DrawerParamList, "EditarVenda">

const COR_APP = 'rgb(199, 216, 50)'

const STATUS = [
    { label: 'Andamento', value: 'A' },
    { label: 'Cancelado', value: 'CA' },
    { label: 'Outro-Concluido', value: 'CO' },
];

const EditarVendaScreen = ({navigation, route}: Props) => {
    return null
}

export default EditarVendaScreen