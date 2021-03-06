import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");

export default class ToDo extends Component {

    constructor(props){
        super(props);
        this.state = { isEditing: false, toDoValue: props.text };
    }

    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteToDo: PropTypes.func.isRequired,
        completedToDo: PropTypes.func.isRequired,
        uncompletedToDo : PropTypes.func.isRequired,
        updateToDo : PropTypes.func.isRequired,
        id: PropTypes.string.isRequired
    }

    render(){
        const { isEditing, toDoValue } = this.state;
        const { text, id, deleteToDo, isCompleted } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPressOut={this._toggleComplete}>
                        <View style={[
                            styles.circle,
                            isCompleted ? styles.complatedCircle : styles.uncomplatedCircle
                            ]
                        }/>
                    </TouchableOpacity>

                    {isEditing ? (
                        <TextInput style={[
                            styles.input,
                            styles.text,
                            isCompleted ? styles.completedText : styles.uncompletedText                        
                        ]}                        
                         value={toDoValue} 
                         multiline={true}
                         onChangeText={this._controlInput}                         
                         />
                    ) : (
                        <Text style={[
                            styles.text, 
                            isCompleted ? styles.completedText : styles.uncompletedText
                        ]}>{text}</Text>
                    ) }                    
                </View>
                {isEditing ? (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this._finishEditing}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>✅</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : ( 
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this._startEditing}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>✏️</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPressOut={(event) => {
                                event.stopPropagation;
                                deleteToDo(id);
                            }}
                            >
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>❌</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }

    _toggleComplete = (event) => {
        event.stopPropagation();
        const { isCompleted, uncompletedToDo, completedToDo, id } = this.props;

        if(isCompleted){
            uncompletedToDo(id);
        }else{
            completedToDo(id);
        }
    }

    _startEditing = (event) => {
        const { text } = this.props;
        this.setState({
            isEditing : true,
            toDoValue : text
        });
    }

    _finishEditing = (event) => {
        const { toDoValue } = this.state;
        const { id, updateToDo } = this.props;

        updateToDo(id, toDoValue);

        this.setState({
            isEditing : false       
        });
    }

    _controlInput = text => {
        this.setState({
            toDoValue : text
        });
    }
}

const styles = StyleSheet.create({
    container: {
        width : width - 50,
        borderBottomColor: "#bbb",
        borderBottomWidth : StyleSheet.hairlineWidth,
        flexDirection : "row",
        alignItems: "center",
        justifyContent : "space-between"
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderColor: "#F23657",
        borderWidth: 3,
        marginRight: 20
    }, 
    complatedCircle : {
        borderColor: "#bbb"
    },
    uncomplatedCircle : {
        borderColor: "#F23657"
    },
    text : {
        fontWeight: "600",
        fontSize: 20,
        marginVertical: 20
    },
    completedText : {
        color : "#dadada",
        textDecorationLine: "line-through"
    }, 
    uncompletedText : {
        color : "#000"
    },
    column : {
        flexDirection : "row",
        alignItems : "center",
        width: width / 2
    },
    actions: {
        flexDirection : "row"

    },
    actionContainer : {
        marginVertical : 10,
        marginHorizontal : 10
    },
    input : {
        marginVertical : 15,
        width : width / 2
    }
});
