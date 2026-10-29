import {StatusBar} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {BleProvider} from "./src/Ble";
import Router from "./src/Router";

const App = () => (
    <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{flex: 1, backgroundColor: "#eee"}}>
            <BleProvider><Router /></BleProvider>
        </SafeAreaView>
    </SafeAreaProvider>
);
export default App;
