import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';
import React, { useState, useEffect } from 'react';

//async function openDatabase() {
  if(!( FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    //console.log("OK");
     FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
   FileSystem.downloadAsync(
    Asset.fromModule(require('./stories.db')).uri,
    FileSystem.documentDirectory + 'SQLite/stories.db'
  );

  const db = SQLite.openDatabase('stories.db');
//}

//const db = openDatabase();
  
export default function App() {
  const [stories, setStories] = useState([]);

  useEffect(() => {

    db.transaction(tx => {

      tx.executeSql('SELECT * FROM story', null,
        (txObj, resultSet) => {
          console.log(resultSet.rows._array);
          setStories(resultSet.rows._array);
        },
        (txObj, error) => console.log(error)
      );

    });
  }, []);

  const showStories = () => {
    return stories.map((story, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text>{story.story_id}</Text>
          <Text>{story.user_id}</Text>
          <Text>{story.title}</Text>
          </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      {showStories()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    margin: 8
  }
});
