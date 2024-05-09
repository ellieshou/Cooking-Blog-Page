const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path'); // Import the path module

const app = express();
const port = 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Ellie', // Your MySQL username
  password: 'Rosey2001!', // Your MySQL password
  database: 'blog' // Your MySQL database name
});

// Connect to MySQL
connection.connect();


// Middleware
app.use(express.json());

// Serve static files (HTML, CSS)
//app.use(express.static('/final.html'));

// Route handler for the root URL
app.get('/posts', (req, res) => {
  res.sendFile(path.join(__dirname, 'final.html'));
});


// Route to display all posts
app.get('/posts', (req, res) => {
  const query = 'SELECT * FROM posts';
  connection.query(query, (error, results) => {
      if (error) {
          res.status(500).send('Error fetching posts');
          console.error('Failed to fetch posts:', error);
      } else {
          // Send the fetched posts to the client
          res.json(results);
      }
  });
});

// Create a new post

app.post('/posts', (req, res) => {
  const { title, content, author } = req.body;
  // Sanitize user input
  const sanitizedTitle = sanitizeHtml(title);
  const sanitizedContent = sanitizeHtml(content);
  const sanitizedAuthor = sanitizeHtml(author);
  
  const sql = 'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)';
  db.query(sql, [sanitizedTitle, sanitizedContent, sanitizedAuthor], (err, result) => {
    if (err) {
      if (err.code !== 'ER_BAD_FIELD_ERROR' && err.code !== 'ER_NO_SUCH_TABLE') {
        throw err; // Rethrow non-MySQL errors
      }
      return res.status(500).json({ error: 'Database error' }); // Handle MySQL-specific errors
    }
    res.send('Post created successfully');
  });
});

// Route to update a post
app.put('/update-post/:id', (req, res) => {
  const { title, content, author } = req.body;
  const postId = req.params.id;
  const query = 'UPDATE posts SET title=?, content=?, author=? WHERE id=?';
  
  connection.query(query, [title, content, author, postId], (error, results) => {
      if (error) {
          res.status(500).send('Error updating post');
          console.error('Failed to update post:', error);
      } else {
          res.send('Post updated successfully');
          res.redirect('/'); // Redirect to the home page after adding the post

      }
  });
});

// Route to delete a post
app.delete('/delete-post/:id', (req, res) => {
  const postId = req.params.id;
  const query = 'DELETE FROM posts WHERE id=?';
  
  connection.query(query, [postId], (error, results) => {
      if (error) {
          res.status(500).send('Error deleting post');
          console.error('Failed to delete post:', error);
      } else {
          res.send('Post deleted successfully');
      }
  });
});

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Route to handle adding a new post
app.post('/add-post', (req, res) => {
  const { title, content, author } = req.body;
  const createdAt = new Date(); // Current date and time
  
  const query = 'INSERT INTO posts (title, content, author, created_at) VALUES (?, ?, ?, ?)';
  
  connection.query(query, [title, content, author, createdAt], (error, results) => {
      if (error) {
          res.status(500).send('Error adding post');
          console.error('Failed to add post:', error);
      } else {
          res.redirect('/'); // Redirect to the home page after adding the post
      }
  });
});





// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
