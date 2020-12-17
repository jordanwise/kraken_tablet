import React from 'react'
import { 
    View, 
    Text,
    TouchableHighlight,
    Image,
 } from 'react-native'
 
 import Divider from './components/divider'
 import OutlineButton from './components/outline_button'
 
 import styles from './styles'
 
 import tempIcon from './icons/temperature-icon.jpg'
 import fsaIcon from './icons/fsa.jpg';
 
let appName = "Kitchen Control"

export default class Home extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    renderTempControlSection() {
        return (
            <View style={styles.flexRowLeft}>
                <Image
                    style={{ width: 200, height: 200 }}
                    source={tempIcon}
                />
                
                <View style={{ flexDirection: 'column', marginRight: 20, justifyContent: 'space-around' }} >
                    <Text style={styles.textSubHeading}>
                        Temp Monitor
                    </Text>

                    <OutlineButton  title="Location 1" onPress={() => this.props.navigation.navigate('Sensors') } 
                        style={{ width: 200, height: 200 }}
                    />
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

                {this.renderTempControlSection()}
                
                <Divider/>

                {this.renderAllergenSection()}

                <Divider/>

                {this.renderSFBBSection()}
                
            </View>
        )
    }
}
