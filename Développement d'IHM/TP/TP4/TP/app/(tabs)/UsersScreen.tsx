import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleUserPress = (user) => {
    setSelectedUser(user);
  };

  if (selectedUser) {
    return <PostsScreen user={selectedUser} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserPress(item)}>
            <Text style={styles.userItem}>{item['name']}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const PostsScreen = ({ user }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, [user.id]);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <Text style={styles.postTitle}>{item['title']}</Text>
            <Text style={styles.postBody}>{item['body']}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userItem: {
    fontSize: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    textAlign: 'center',
  },
  postItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postBody: {
    fontSize: 14,
  },
});

export default UsersScreen;