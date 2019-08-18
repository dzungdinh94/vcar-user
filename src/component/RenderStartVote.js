//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { values } from '../config';
var numberOfStar = 4;
// create a component

class RenderStartVote extends Component {
    constructor(props) {
        super(props)
        this.state = {
        };
        this.clickStar = this.clickStar.bind(this);
    };
    clickStar(index) {
        numberOfStar = index;
        this.props.voteStar(index);
    }
    render() {
        return (
            <Animatable.View
                animation={'fadeIn'}
                duration={1000}
                style={[{
                    flexDirection: 'row', width: '100%', justifyContent: 'center',
                    alignItems: 'center', backgroundColor: 'transparent'
                }, this.props.styleParent]}>

                <TouchableOpacity activeOpacity={values.activeOpacity} onPress={() => this.clickStar(1)}
                    style={styles.viewStart}>
                    <Image style={[styles.img_star, this.props.styleImgStart]} source={
                        numberOfStar >= 1
                            ?
                            require('../assets/images/star.png')
                            :
                            require('../assets/images/star-border.png')
                    } />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={values.activeOpacity} onPress={() => this.clickStar(2)}
                    style={styles.viewStart}>
                    <Image style={[styles.img_star, this.props.styleImgStart]} source={
                        numberOfStar >= 2
                            ?
                            require('../assets/images/star.png')
                            :
                            require('../assets/images/star-border.png')} />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={values.activeOpacity} onPress={() => this.clickStar(3)}
                    style={styles.viewStart}>
                    <Image style={[styles.img_star, this.props.styleImgStart]} source={
                        numberOfStar >= 3
                            ?
                            require('../assets/images/star.png')
                            :
                            require('../assets/images/star-border.png')} />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={values.activeOpacity} onPress={() => this.clickStar(4)}
                    style={styles.viewStart}>
                    <Image style={[styles.img_star, this.props.styleImgStart]} source={
                        numberOfStar >= 4
                            ?
                            require('../assets/images/star.png')
                            :
                            require('../assets/images/star-border.png')} />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={values.activeOpacity} onPress={() => this.clickStar(5)}
                    style={styles.viewStart}>
                    <Image style={[styles.img_star, this.props.styleImgStart]} source={
                        numberOfStar >= 5
                            ?
                            require('../assets/images/star.png')
                            :
                            require('../assets/images/star-border.png')} />
                </TouchableOpacity>
            </Animatable.View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    viewStart: { backgroundColor: 'transparent', width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    img_star: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
});

//make this component available to the app
export default RenderStartVote;
