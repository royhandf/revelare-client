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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Book List</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Add New Book
              </DialogTitle>
            </DialogHeader>
            <form className="grid grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Digital Economics"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="authors">Authors</Label>
                  <Input
                    id="authors"
                    placeholder="e.g., John Doe; Jane Smith"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="editors">Editor</Label>
                  <Input
                    id="editors"
                    placeholder="e.g., Michael Brown; Sarah Lee"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    placeholder="e.g., Springer Nature"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Publication Year</Label>
                  <Input
                    id="year"
                    placeholder="e.g., 2024"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    placeholder="e.g., 978-3-16-148410-0"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="bookFile">Book File</Label>
                  <Input
                    id="bookFile"
                    type="file"
                    accept=".pdf"
                    className="mt-1.5 file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-violet-600 file:text-white hover:file:bg-violet-700 file:cursor-pointer"
                  />
                </div>
                <div>
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    className="mt-1.5 file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-violet-600 file:text-white hover:file:bg-violet-700 file:cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Write book description here"
                    className="mt-1.5 min-h-[180px] resize-none"
                  />
                </div>
                <div>
                  <Label htmlFor="toc">Table of Contents</Label>
                  <Textarea
                    id="toc"
                    placeholder="Write table of contents here"
                    className="mt-1.5 min-h-[180px] resize-y"
                  />
                </div>
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-4">
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogTrigger>
                <Button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  Save
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
          </DialogHeader>
          {editingBook && (
            <form className="grid grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    defaultValue={editingBook.title}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-authors">Authors</Label>
                  <Input
                    id="edit-authors"
                    defaultValue={editingBook.authors}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-editors">Editor</Label>
                  <Input
                    id="edit-editors"
                    defaultValue={editingBook.editors}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-publisher">Publisher</Label>
                  <Input
                    id="edit-publisher"
                    defaultValue={editingBook.publisher}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-year">Publication Year</Label>
                  <Input
                    id="edit-year"
                    defaultValue={editingBook.published}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-isbn">ISBN</Label>
                  <Input
                    id="edit-isbn"
                    defaultValue={editingBook.isbn}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-bookFile">Book File</Label>
                  <Input
                    id="edit-bookFile"
                    type="file"
                    accept=".pdf"
                    className="mt-1.5 file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-violet-600 file:text-white hover:file:bg-violet-700 file:cursor-pointer"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-coverImage">Cover Image</Label>
                  <Input
                    id="edit-coverImage"
                    type="file"
                    accept="image/*"
                    className="mt-1.5 file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-violet-600 file:text-white hover:file:bg-violet-700 file:cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    defaultValue={editingBook.description}
                    className="mt-1.5 min-h-[180px] resize-none"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-toc">Table of Contents</Label>
                  <Textarea
                    id="edit-toc"
                    defaultValue={editingBook.table_of_contents}
                    className="mt-1.5 min-h-[180px] resize-y"
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
                >
                  Save Changes
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
