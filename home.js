import React from 'react'

import { 
    View, 
    Text,
    TouchableHighlight,
    Image,
} from 'react-native'

import { connect } from "react-redux";

import Divider from './components/divider'
import OutlineButton from './components/outline_button'
import SensorTile from './components/sensor_tile'
import Clock from './components/clock'

import styles from './styles'

import tempIcon from './icons/temperature-icon.jpg'
import fsaIcon from './icons/fsa.jpg';

let appName = "Kitchen Control"

class Home extends React.Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
    }    

    renderTempControlSection() {

        console.log("Sensor list:")
        console.log(this.props.sensorList)

        let sensorDisplay = []
        this.props.sensorList.forEach(element => {
            sensorDisplay.push( <SensorTile/> )
        });

        return (
            <View style={styles.flexRowLeft}>
                <Image
                    style={{ width: 150, height: 150 }}
                    source={tempIcon}
                />

                <View style={{ flexDirection: 'column', marginRight: 20, justifyContent: 'space-around' }} >
                    <View style={{flexDirection: 'row'}}> 
                        {sensorDisplay}             
                    </View>
                </View>
            </View>
        )
    }

    renderAllergenSection() {
        return (
            <View style={styles.flexRowRight}>
                <View style={{ flexDirection: 'column', marginRight: 20, justifyContent: 'space-around' }} >
                    <OutlineButton title="Allergen Ingredients" onPress={() => this.props.navigation.navigate('AllergenIngredient')} />
                    <OutlineButton title="Allergen Recipes" onPress={() => this.props.navigation.navigate('AllergenRecipe')} />
                </View>

                <TouchableHighlight
                    onPress={() => this.props.navigation.navigate('SFBB')}>
                    <Image
                        style={{ width: 200, height: 200 }}
                        source={fsaIcon}
                    />
                </TouchableHighlight>
            </View>
        )
    }

    renderSFBBSection() {
        return(
            <View style={{ flexDirection: 'column', marginRight: 20, justifyContent: 'space-around' }} >
                <OutlineButton title="Cleaning" onPress={() => this.props.navigation.navigate('SFBBCategory', { filename: 'sfbb-cleaning.pdf' })} />
                <OutlineButton title="Cooking" onPress={() => this.props.navigation.navigate('SFBBCategory', { filename: 'sfbb-cooking.pdf' })} />
                <OutlineButton title="Dairy" onPress={() => this.props.navigation.navigate('SFBBCategory', { filename: 'sfbb-dairy.pdf' })} />
                <OutlineButton title="Management" onPress={() => this.props.navigation.navigate('SFBBCategory', { filename: 'sfbb-management.pdf' })} />
            </View>
        )
    }

    render() {
        return (
            <View style={styles.mainBody}>
                <Text style={styles.textTitle}>{appName}</Text>

                <Divider/>

                <Clock/>

                {this.renderTempControlSection()}
                
                <Divider/>

                {this.renderAllergenSection()}

                <Divider/>

                {this.renderSFBBSection()}
                
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        loginInfo: state.loginReducer.loginInfo,
        sensorList : state.sensorReducer.sensorList,
    }
}

export default connect(mapStateToProps)(Home)
