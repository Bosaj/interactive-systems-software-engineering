import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const PostList = () => {
   const [posts, setPosts] = useState([]);
   const [title, setTitle] = useState('');
   const [body, setBody] = useState('');

   useEffect(() => {
         const fetchPost = async () => {
            try {
               const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
               const data = await response.json();
               setPosts(data);
            } catch (error) {
               alert(error);
            }
         };
         fetchPost();
   }, []);

   const AddPost = async (title, body) => {
      try {
         let response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
               title: title,
               body: body,
               userId: uuidv4(),
            }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
         });
         let data = await response.json();
         setPosts(posts => [data, ...posts]);
      } catch (error) {
         alert(error);
      }
      setTitle('');
      setBody('');
  };

  const handleSubmit = (e) => {
   e.preventDefault();
   AddPost(title, body);
};   

   const deletePost = async (id) => {
      try {
         let response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`,  { method: 'DELETE' });
         if (response.status === 200) {
            setPosts(posts.filter(post => post.id !== id));
         } else {
            return;
         }
      } catch (error) {
         alert(error);
      }
   };

return (
    <>
      <div className="posts-container">
         {posts.map((post) => {
            return (
               <div className="post-card" key={post.id}>
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-body">{post.body}</p>
                  <div className="button">
                     <button className="delete-btn" onClick={() => deletePost(post.id)}>Delete</button>
                  </div>
               </div>
            );
         })}
      </div>
      <div className="add-post-container">
         <form onSubmit={handleSubmit}>
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea name="" className="form-control" id="" cols="10" rows="8"  value={body} onChange={(e) => setBody(e.target.value)}></textarea>
            <button type="submit">Add Post</button>
         </form>
      </div>
    </>
);
};

export default PostList;