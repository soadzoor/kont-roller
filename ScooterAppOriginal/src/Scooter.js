import React, { Component } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

import MainView from "./components/MainView"
import Button from "./components/Button"
import ScooterMain from "./ScooterMain";
import ScooterSettings from "./ScooterSettings";

const style = StyleSheet.create({
    topSpace: {
        marginTop: 12
    },
    center: {
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center"
    },
    error: {
        color: "#B71C1C",
        fontSize: 20,
        textAlign: "center"
    }
})

class Scooter extends Component {
    state = {
        page: "main"
    }
    renderError = () => (
        <View style={style.center}>
            <Text style={style.error}>Hiba történt</Text>
            <Text style={style.error}>{this.props.error?.toString?.()}</Text>
            <Button style={style.topSpace} onClick={this.props.onLoad}>Újra próbálkozás</Button>
        </View>
    )

    renderPage = () => (
        this.state.page === "main" ? (
            <ScooterMain {...this.props} onSettings={() => this.setState({ page: "settings" })} />
        ) : this.state.page === "settings" ? (
            <ScooterSettings {...this.props} onBack={() => this.setState({ page: "main" })}/>
        ) : null
    )

    renderLoading = () => (
        <View style={style.center}>
            <ActivityIndicator size="large" color="#202020" style={style.topSpace}/>
        </View>
    )

    render() {
        return (
            <MainView>
                {this.props.error ? (
                    this.renderError()
                ) : (this.props.api && this.props.connected) ? (
                    this.renderPage()
                ) : (
                    this.renderLoading()
                )}
            </MainView>
        )
    }
}

export default Scooter