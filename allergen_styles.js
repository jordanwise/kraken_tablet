import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    cellText: {
        flex: 1, 
        justifyContent: 'center',
        alignItems:"center",
    },
    ingredientNameInput: {
        flex:0,
        marginTop: 10,
        marginBottom: 10,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    cellImage: {
        flex: 2,
    },
    body: {
        paddingTop: 10, 
        paddingLeft: 50, 
        paddingRight: 10,
    },
    listText: {
        fontSize: 20,
    }
});
