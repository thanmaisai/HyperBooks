import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, Typography, Button, CircularProgress, Alert, useTheme, Divider } from '@mui/material';
import AddBookModal from '../Admins/AddBookForm';
import UpdateBookModal from '../Users/UpdateBookForm';
import BooksList from '../Books/BooksList';
import SearchBar from '../Search/SearchBar';
import { GET_BOOKS, DELETE_BOOK, BORROW_BOOK } from '../../gqloperations/mutations';

const ManageBooks = () => {
  const theme = useTheme(); // Get the current theme
  const { data, loading, error, refetch } = useQuery(GET_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOK, {
    onCompleted: () => refetch(),
    onError: (error) => console.error("Error deleting book:", error),
  });
  const [borrowBook] = useMutation(BORROW_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchText, setSearchText] = useState('');

  const handleDelete = async (bookId) => {
    try {
      await deleteBook({ variables: { _id: bookId } });
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleUpdate = (book) => {
    setSelectedBook(book);
    setUpdateModalOpen(true);
  };

  const handleBorrow = async (bookId) => {
    try {
      await borrowBook({ variables: { _id: bookId } });
    } catch (error) {
      console.error("Error borrowing book:", error);
    }
  };

  const filteredBooks = data?.books.filter(book =>
    book.title.toLowerCase().includes(searchText.toLowerCase()) ||
    book.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleBookAdded = () => {
    refetch(); // Refetch books after adding a new book
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Books
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
          sx={{
            borderRadius: 2,
            padding: '10px 20px',
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6,
            }
          }}
        >
          Add New Book
        </Button>
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          onSearch={() => {}}
          sx={{ width: '300px' }}
        />
      </Box>
      <AddBookModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onBookAdded={handleBookAdded} />
      <UpdateBookModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        book={selectedBook}
        refetch={refetch}
      />
      <Divider sx={{ my: 4 }} />
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          p: 3,
          boxShadow: 3,
        }}
      >
        <BooksList
          books={filteredBooks}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          role="admin"
          onBorrow={handleBorrow}
        />
      </Box>
    </Box>
  );
};

export default ManageBooks;
