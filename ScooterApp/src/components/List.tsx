import React from "react";
import {ScrollView, RefreshControl, StyleSheet, StyleProp} from "react-native";

const styles = StyleSheet.create({
    view: {
        flexGrow: 1
    }
});

interface IProps
{
    children: React.ReactNode;
    onRefresh?: () => void;
    style?: StyleProp<any>;
}

const List = ({children, onRefresh, style}: IProps) => (
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
