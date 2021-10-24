import React from "react";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    view: {
        flexGrow: 1
    }
});

const List = ({ children, onRefresh, style }) => (
    <ScrollView
        style={StyleSheet.compose(styles.view, style)}
        refreshControl={onRefresh ? (
            <RefreshControl 
                onRefresh={onRefresh}
                refreshing={false}
            />
        ) : undefined}
    >
        {children}
    </ScrollView>
)

export default List;
