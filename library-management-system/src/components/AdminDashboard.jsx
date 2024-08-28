import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOOKS, DELETE_BOOK } from '../gqloperations/mutations';
import AddBookModal from './AddBookForm';
import UpdateBookModal from './UpdateBookForm';
import BooksList from './BooksList';

const AdminDashboard = () => {
  const { data, loading, error, refetch } = useQuery(GET_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOK, {
    onCompleted: () => refetch(),
    onError: (error) => console.error("Error deleting book:", error),
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading books: {error.message}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="mb-4 py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
      >
        Add New Book
      </button>
      <AddBookModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      <UpdateBookModal isOpen={isUpdateModalOpen} onClose={() => setUpdateModalOpen(false)} book={selectedBook} />
      <div className="mt-8">
        <BooksList books={data.books} onDelete={handleDelete} onUpdate={handleUpdate} />
      </div>
    </div>
  );
};

export default AdminDashboard;
