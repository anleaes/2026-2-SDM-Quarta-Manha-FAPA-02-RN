import { DrawerParamList } from "@/navigation/DrawNavigator";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { Image, StyleSheet, View } from "react-native";


type Props = DrawerScreenProps<DrawerParamList, 'Home'>

const HomeScreen = ({navigation} : Props) => {
    return (
        <View style={styles.container}>
            {/*Grid do banner*/}
            <View>
                <Image source={require('@/assets/images/ticket.png')}/>
            </View>
            {/*Grid dos botoes*/}
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