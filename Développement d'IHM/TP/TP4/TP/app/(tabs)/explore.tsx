
import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import {FlatList,  Text } from 'react-native';


export default function TabTwoScreen() {
  const [posts, setPosts] = useState([]);
  
    useEffect(() => {
      const fetchProducts = async () => {
          const response = await fetch('https://jsonplaceholder.typicode.com/posts');
          const data = await response.json();
          setPosts(data);
      };
  
      fetchProducts();
    }, []);
  return (
    <FlatList
        data={posts}
        renderItem={({item}) => <Text>{item['title']}</Text>}
        />
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
