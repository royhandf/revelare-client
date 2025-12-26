"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Pencil,
  Trash2,
  Eye,
  Download,
  MoreVertical,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  bookService,
  BookDetail,
  UnauthorizedError,
} from "@/lib/services/book";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BooksPage() {
  const { data: session } = useSession();
  const [books, setBooks] = useState<BookDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingBook, setEditingBook] = useState<BookDetail | null>(null);
  const [deletingBook, setDeletingBook] = useState<BookDetail | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({
    title: "",
    authors: "",
    editors: "",
    publisher: "",
    published: "",
    isbn: "",
    description: "",
    table_of_contents: "",
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    authors: "",
    editors: "",
    publisher: "",
    published: "",
    isbn: "",
    description: "",
    table_of_contents: "",
  });
  const [editPdfFile, setEditPdfFile] = useState<File | null>(null);
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (editingBook) {
      setEditForm({
        title: editingBook.title || "",
        authors: editingBook.authors || "",
        editors: editingBook.editors || "",
        publisher: editingBook.publisher || "",
        published: editingBook.published?.toString() || "",
        isbn: editingBook.isbn || "",
        description: editingBook.description || "",
        table_of_contents: editingBook.table_of_contents || "",
      });
      setEditPdfFile(null);
      setEditCoverFile(null);
    }
  }, [editingBook]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!session?.user?.accessToken) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await bookService.dashboardGetAll(
          session.user.accessToken,
          currentPage,
          debouncedSearch
        );
        setBooks(response.data);
        setTotalPages(response.total_pages);
        setTotalBooks(response.total_books);
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          signOut({ callbackUrl: "/signin" });
          return;
        }
        toast.error("Failed to fetch books");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, [session?.user?.accessToken, currentPage, debouncedSearch]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const refetchBooks = async () => {
    if (!session?.user?.accessToken) return;
    try {
      const response = await bookService.dashboardGetAll(
        session.user.accessToken,
        currentPage,
        debouncedSearch
      );
      setBooks(response.data);
      setTotalPages(response.total_pages);
      setTotalBooks(response.total_books);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        signOut({ callbackUrl: "/signin" });
      }
    }
  };

  const handleDelete = async () => {
    if (!session?.user?.accessToken || !deletingBook) return;

    setIsDeleting(true);
    try {
      await bookService.dashboardDelete(
        session.user.accessToken,
        deletingBook.id
      );
      toast.success("Book deleted successfully");
      setDeletingBook(null);
      refetchBooks();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        signOut({ callbackUrl: "/signin" });
        return;
      }
      toast.error("Failed to delete book");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.accessToken) return;

    if (!addForm.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsAdding(true);
    try {
      const formData = new FormData();
      formData.append("title", addForm.title);
      formData.append("authors", addForm.authors);
      formData.append("editors", addForm.editors);
      formData.append("publisher", addForm.publisher);
      formData.append("published", addForm.published);
      formData.append("isbn", addForm.isbn);
      formData.append("description", addForm.description);
      formData.append("table_of_contents", addForm.table_of_contents);
      if (pdfFile) formData.append("pdf_link", pdfFile);
      if (coverFile) formData.append("cover_link", coverFile);

      await bookService.dashboardCreate(session.user.accessToken, formData);
      toast.success("Book added successfully");
      setIsAddDialogOpen(false);
      setAddForm({
        title: "",
        authors: "",
        editors: "",
        publisher: "",
        published: "",
        isbn: "",
        description: "",
        table_of_contents: "",
      });
      setPdfFile(null);
      setCoverFile(null);
      refetchBooks();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        signOut({ callbackUrl: "/signin" });
        return;
      }
      toast.error("Failed to add book");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.accessToken || !editingBook) return;

    if (!editForm.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsEditing(true);
    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("authors", editForm.authors);
      formData.append("editors", editForm.editors);
      formData.append("publisher", editForm.publisher);
      formData.append("published", editForm.published);
      formData.append("isbn", editForm.isbn);
      formData.append("description", editForm.description);
      formData.append("table_of_contents", editForm.table_of_contents);
      if (editPdfFile) formData.append("pdf_link", editPdfFile);
      if (editCoverFile) formData.append("cover_link", editCoverFile);

      await bookService.dashboardUpdate(
        session.user.accessToken,
        editingBook.id,
        formData
      );
      toast.success("Book updated successfully");
      setEditingBook(null);
      refetchBooks();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        signOut({ callbackUrl: "/signin" });
        return;
      }
      toast.error("Failed to update book");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Book List</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-6xl max-h-[90vh] overflow-y-auto"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Add New Book
              </DialogTitle>
              <DialogDescription className="sr-only">
                Fill in the form to add a new book
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleAddSubmit}
              className="grid grid-cols-2 gap-6 mt-4"
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="add-title">Title *</Label>
                  <Input
                    id="add-title"
                    placeholder="e.g., Digital Economics"
                    className="mt-1.5"
                    value={addForm.title}
                    onChange={(e) =>
                      setAddForm({ ...addForm, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="add-authors">Authors</Label>
                  <Input
                    id="add-authors"
                    placeholder="e.g., John Doe; Jane Smith"
                    className="mt-1.5"
                    value={addForm.authors}
                    onChange={(e) =>
                      setAddForm({ ...addForm, authors: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="add-editors">Editor</Label>
                  <Input
                    id="add-editors"
                    placeholder="e.g., Michael Brown; Sarah Lee"
                    className="mt-1.5"
                    value={addForm.editors}
                    onChange={(e) =>
                      setAddForm({ ...addForm, editors: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="add-publisher">Publisher</Label>
                  <Input
                    id="add-publisher"
                    placeholder="e.g., Springer Nature"
                    className="mt-1.5"
                    value={addForm.publisher}
                    onChange={(e) =>
                      setAddForm({ ...addForm, publisher: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="add-year">Publication Year</Label>
                  <Input
                    id="add-year"
                    placeholder="e.g., 2024"
                    className="mt-1.5"
                    value={addForm.published}
                    onChange={(e) =>
                      setAddForm({ ...addForm, published: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="add-isbn">ISBN</Label>
                  <Input
                    id="add-isbn"
                    placeholder="e.g., 9783161484100"
                    className="mt-1.5"
                    value={addForm.isbn}
                    onChange={(e) =>
                      setAddForm({ ...addForm, isbn: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="add-bookFile">Book File (PDF)</Label>
                  <Input
                    id="add-bookFile"
                    type="file"
                    accept=".pdf"
                    className="mt-1.5 file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-violet-600 file:text-white hover:file:bg-violet-700 file:cursor-pointer"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div>
                  <Label htmlFor="add-coverImage">Cover Image</Label>
                  <Input
                    id="add-coverImage"
                    type="file"
                    accept="image/*"
                    className="mt-1.5 file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-violet-600 file:text-white hover:file:bg-violet-700 file:cursor-pointer"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="add-description">Description</Label>
                  <Textarea
                    id="add-description"
                    placeholder="Write book description here"
                    className="mt-1.5 min-h-[180px] resize-none"
                    value={addForm.description}
                    onChange={(e) =>
                      setAddForm({ ...addForm, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="add-toc">Table of Contents</Label>
                  <Textarea
                    id="add-toc"
                    placeholder="Write table of contents here"
                    className="mt-1.5 min-h-[180px] resize-y"
                    value={addForm.table_of_contents}
                    onChange={(e) =>
                      setAddForm({
                        ...addForm,
                        table_of_contents: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                  disabled={isAdding}
                >
                  {isAdding ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by title, author, or editor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border-gray-200 focus-visible:ring-violet-600"
        />
      </div>

      <div className="border rounded-lg bg-white overflow-x-auto">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700 w-16">
                NO
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                BOOK
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                AUTHOR
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                EDITOR
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                PUBLISHER
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                PUBLICATION DATE
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-center">
                ACTION
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-violet-600 border-t-transparent rounded-full" />
                    <span className="text-gray-500">Loading books...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-10 w-10 text-gray-300" />
                    <p className="text-gray-500">No books found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              books.map((book, index) => (
                <TableRow key={book.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900 align-middle">
                    {(currentPage - 1) * 10 + index + 1}
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={book.cover_link || "/images/placeholder-book.png"}
                        alt={book.title}
                        width={64}
                        height={80}
                        className="object-cover rounded shadow-sm flex-shrink-0 w-16 h-20"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/placeholder-book.png";
                        }}
                      />
                      <span className="text-gray-900 font-medium leading-snug line-clamp-2">
                        {book.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 align-middle max-w-[150px]">
                    <span className="line-clamp-2">{book.authors || "-"}</span>
                  </TableCell>
                  <TableCell className="text-gray-700 align-middle max-w-[150px]">
                    <span className="line-clamp-2">{book.editors || "-"}</span>
                  </TableCell>
                  <TableCell className="text-gray-700 align-middle max-w-[120px]">
                    <span className="line-clamp-2">{book.publisher}</span>
                  </TableCell>
                  <TableCell className="text-gray-700 align-middle">
                    {book.published}
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex items-center justify-center gap-1.5">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            className="h-7 w-7 bg-blue-500 hover:bg-blue-600 text-white"
                            title="Book details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-semibold text-gray-900">
                              Book Details
                            </DialogTitle>
                            <DialogDescription className="sr-only">
                              View book details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex gap-4 mt-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                book.cover_link ||
                                "/images/placeholder-book.png"
                              }
                              alt={book.title}
                              width={100}
                              height={150}
                              className="object-cover rounded shadow-sm flex-shrink-0 w-24 h-36"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/images/placeholder-book.png";
                              }}
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 leading-snug">
                                {book.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {book.authors || "-"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-4 mt-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                ISBN
                              </h4>
                              <p className="text-gray-900">{book.isbn}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Description
                              </h4>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {book.description || "-"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Table of Contents
                              </h4>
                              <p className="text-gray-700 text-sm">
                                {book.table_of_contents || "-"}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-gray-100"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => window.open(book.pdf_link, "_blank")}
                          >
                            <Download className="h-4 w-4 text-green-500" />
                            <span>Download</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setEditingBook(book)}
                          >
                            <Pencil className="h-4 w-4 text-yellow-500" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={() => setDeletingBook(book)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {books.length > 0 ? (currentPage - 1) * 10 + 1 : 0} -{" "}
          {Math.min(currentPage * 10, totalBooks)} of {totalBooks}
        </div>
        {totalPages > 1 && (
          <Pagination className="w-auto mx-0 justify-end">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={cn(
                    "h-8 text-sm",
                    currentPage === 1 &&
                      "cursor-not-allowed opacity-50 pointer-events-none"
                  )}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) page = i + 1;
                  else if (currentPage >= totalPages - 2)
                    page = totalPages - 4 + i;
                  else page = currentPage - 2 + i;
                }
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={currentPage === page}
                      className={cn(
                        "h-8 w-8 text-sm",
                        currentPage === page &&
                          "bg-violet-600 text-white hover:bg-violet-700 border-violet-600"
                      )}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={cn(
                    "h-8 text-sm",
                    currentPage === totalPages &&
                      "cursor-not-allowed opacity-50 pointer-events-none"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <Dialog
        open={!!editingBook}
        onOpenChange={(open) => !open && setEditingBook(null)}
      >
        <DialogContent
          className="max-w-6xl max-h-[90vh] overflow-y-auto"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Edit Book
            </DialogTitle>
            <DialogDescription className="sr-only">
              Edit book details
            </DialogDescription>
          </DialogHeader>
          {editingBook && (
            <form
              onSubmit={handleEditSubmit}
              className="grid grid-cols-2 gap-6 mt-4"
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    className="mt-1.5"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-authors">Authors</Label>
                  <Input
                    id="edit-authors"
                    className="mt-1.5"
                    value={editForm.authors}
                    onChange={(e) =>
                      setEditForm({ ...editForm, authors: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-editors">Editor</Label>
                  <Input
                    id="edit-editors"
                    className="mt-1.5"
                    value={editForm.editors}
                    onChange={(e) =>
                      setEditForm({ ...editForm, editors: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-publisher">Publisher</Label>
                  <Input
                    id="edit-publisher"
                    className="mt-1.5"
                    value={editForm.publisher}
                    onChange={(e) =>
                      setEditForm({ ...editForm, publisher: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-year">Publication Year</Label>
                  <Input
                    id="edit-year"
                    className="mt-1.5"
                    value={editForm.published}
                    onChange={(e) =>
                      setEditForm({ ...editForm, published: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-isbn">ISBN</Label>
                  <Input
                    id="edit-isbn"
                    className="mt-1.5"
                    value={editForm.isbn}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isbn: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-bookFile">
                    Book File (PDF) - Leave empty to keep current
                  </Label>
                  <Input
                    id="edit-bookFile"
                    type="file"
                    accept=".pdf"
                    className="mt-1.5 file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-violet-600 file:text-white hover:file:bg-violet-700 file:cursor-pointer"
                    onChange={(e) =>
                      setEditPdfFile(e.target.files?.[0] || null)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-coverImage">
                    Cover Image - Leave empty to keep current
                  </Label>
                  <Input
                    id="edit-coverImage"
                    type="file"
                    accept="image/*"
                    className="mt-1.5 file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-violet-600 file:text-white hover:file:bg-violet-700 file:cursor-pointer"
                    onChange={(e) =>
                      setEditCoverFile(e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    className="mt-1.5 min-h-[180px] resize-none"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-toc">Table of Contents</Label>
                  <Textarea
                    id="edit-toc"
                    className="mt-1.5 min-h-[180px] resize-y"
                    value={editForm.table_of_contents}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        table_of_contents: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingBook(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                  disabled={isEditing}
                >
                  {isEditing ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingBook}
        onOpenChange={(open) => !open && setDeletingBook(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingBook?.title}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
