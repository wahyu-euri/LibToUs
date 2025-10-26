import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bookService from "../../services/bookService";
import BookForm from "../../components/forms/BookForm";
import Alert from "../../components/ui/Alert";

const BookAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const handleSubmit = async (formData) => {
    setLoading(true);
    setAlert({ show: false, message: "", type: "" });

    try {
      // 🔧 Ubah formData biasa jadi FormData() agar file bisa dikirim
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Panggil API create book
      await bookService.createBook(data);

      // ✅ Tampilkan pesan sukses
      setAlert({
        show: true,
        message: "Book added successfully!",
        type: "success",
      });

      // Redirect setelah 2 detik
      setTimeout(() => {
        navigate("/admin/books");
      }, 2000);
    } catch (error) {
      console.error("Error adding book:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Failed to add book";

      setAlert({
        show: true,
        message: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-add-page">
      <h2>Add New Book</h2>

      {alert.show && (
        <Alert type={alert.type} message={alert.message} dismissible />
      )}

      <BookForm onSubmit={handleSubmit} loading={loading} submitText="Add Book" />
    </div>
  );
};

export default BookAdd;
