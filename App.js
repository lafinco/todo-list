import React from 'react';
import { AsyncStorage, StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView } from 'react-native';
import { AppLoading } from "expo";
import ToDo from "./ToDo";
import uuid from "uuid/v1";
import PropTypes from "prop-types";

const {height, width} = Dimensions.get("window");

export default class App extends React.Component {

  state = {
    newToDo : "",
    loadedToDos : false,
    toDos : {}
  }

  componentDidMount = () => {
    this._loadToDos();
  }

  render() {
    const { newToDo, loadedToDos, toDos } = this.state;

    if( !loadedToDos ){
      return <AppLoading />;
    }else{ 
      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Text style={styles.title}>Kawai Todo</Text>
          <View style={styles.card}>
            <TextInput 
              style={styles.input} 
              placeholder={"New To Do"} 
              value={newToDo} 
              onChangeText={this._crontoNewToDo} 
              placeholderTextColor={"#999"}
              returnKeyType={"done"}
              autoCorrect={false}
              onSubmitEditing={this._addToDo}
              />
              <ScrollView contentContainerStyle={styles.toDos}>
                {Object.values(toDos).reverse().map(toDo => 
                  <ToDo key={toDo.id} 
                  deleteToDo={this._deleteToDo}
                  uncompletedToDo={this._uncompletedToDo}
                  completedToDo={this._completedToDo}
                  updateToDo={this._updateToDo}
                  {...toDo} />
                )}
              </ScrollView>
          </View>
        </View>
      );
    }
  }

  _crontoNewToDo = text => {
    this.setState({
      newToDo : text
    });
  }

  _loadToDos = async () => {

    try{
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos);
      this.setState({
        loadedToDos : true,
        toDos : parsedToDos || {}
      });
    }catch(err){
      console.log(err);
    }

    
  }

  _addToDo = () => {
    const { newToDo } = this.state;
    if(newToDo !== ""){     

      this.setState( prevState => {
        const ID = uuid();
        const newToDoObject = {
          [ID] : {
            id : ID,
            isCompleted : false,
            text : newToDo,
            createdAt : Date.now()
          }
        }

        const newState = {
          ...prevState,
          newToDo : "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }          
        }

        this._saveToDos(newState.toDos);

        return { ...newState };
      });
      
      
    }
  }

  _deleteToDo = (id) => {
    this.setState( prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };

      this._saveToDos(newState.toDos);

      return { ...newState }
    });
  }

  _uncompletedToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            isCompleted : false
          }
        }
      };

      this._saveToDos(newState.toDos);
      
      return { ...newState }; 
    });
  }

  _completedToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            isCompleted : true
          }
        }
      };

      this._saveToDos(newState.toDos);
      
      return { ...newState }; 
    });
  }

  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            text: text
          }
        }
      };

      this._saveToDos(newState.toDos);
      
      return { ...newState }; 
    });
  }

  _saveToDos = (newToDos) =>{
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  }
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title : {
    color: "white",
    fontSize : 30,
    marginTop : 50,
    marginBottom : 30,
    fontWeight : "200"
  },
  card : {
    backgroundColor: "white",
    flex : 1,
    width : width - 25,
    borderTopLeftRadius : 10,
    borderTopRightRadius : 10,
    ...Platform.select({
        ios : {
          shadowColor : "rgba(50, 50, 50)",
          shadowOpacity : 0.5,
          shadowRadius : 5,
          shadowOffset : {
            height : -1,
            width : 0
          }
        },
        android : {
          elevation : 3
        }
    })
  },
  input : {
      padding: 20,
      borderBottomColor: "#bbb",
      borderBottomWidth : 1,
      fontSize : 25
  },

  toDos: {
      alignItems: "center"
  }
});
