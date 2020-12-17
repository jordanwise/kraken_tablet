import { StyleSheet } from 'react-native';

var secondaryColor = '#000';

var backgroundColor = '#fff';
var primaryTextColor = '#000';

var red = '#ff0000';
var paleBlue = '#66a3ff';
var grey = '#f6f8fa';

var homePageWidth = '80%';

export default StyleSheet.create({
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: paleBlue,
    },

    mainBody: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: grey,
    },

    normalPage: {
        flex:1,
        alignItems: 'center',
        backgroundColor: grey,
    },

    flexRowLeft: {
        width: homePageWidth,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    flexRowRight: {
        width: homePageWidth,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    homeTitle: {
        height: '100%',
        width: '100%',

        fontSize: 20,
        fontWeight: 'bold',
        fontWeight: 'bold',
        color: '#f00',
        // overflowY: 'auto',
    
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    textTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: primaryTextColor,
    },

    textSubHeading: { 
        fontSize: 30,
        fontWeight: 'bold',
        color: primaryTextColor,
    },

    textParagraph: {
        fontSize: 18,
        color: primaryTextColor,
    },
});
