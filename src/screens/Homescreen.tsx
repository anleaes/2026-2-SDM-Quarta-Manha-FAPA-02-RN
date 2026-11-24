import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { StyleSheet, View } from "react-native";


type Props = DrawerScreenProps<DrawerParamList, 'Home'>

const HomeScreen = ({navigation} : Props) => {
    return (
        <View style={styles.container}>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})

export default HomeScreen