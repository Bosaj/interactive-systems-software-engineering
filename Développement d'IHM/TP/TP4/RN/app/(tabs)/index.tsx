import React from 'react';
import { useState, useEffect } from 'react';
import {FlatList, Text, View} from 'react-native';
const FlatListBasics = () => {
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      const fetchProducts = async () => {
          const response = await fetch('https://jsonplaceholder.typicode.com/users');
          const data = await response.json();
          setUsers(data);
      };
  
      fetchProducts();
    }, []);
return (
<View>
<FlatList
data={users}
renderItem={({item}) => <Text>{item['name']}</Text>}
/>
</View>
);
};
export default FlatListBasics;