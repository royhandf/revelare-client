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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { userService, User, UnauthorizedError } from "@/lib/services/user";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.user?.accessToken) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await userService.getAll(session.user.accessToken);
        setUsers(response.data);
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          signOut({ callbackUrl: "/signin" });
          return;
        }
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [session?.user?.accessToken]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User List</h1>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border-gray-200 focus-visible:ring-violet-600"
        />
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700 w-16">
                NO
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                NAME
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                EMAIL
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                ROLE
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                REGISTERED DATE
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-center">
                ACTION
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-violet-600 border-t-transparent rounded-full" />
                    <span className="text-gray-500">Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-10 w-10 text-gray-300" />
                    <p className="text-gray-500">No users found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user, index) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="text-gray-900 font-normal">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-blue-600 hover:underline">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        user.role === "admin"
                          ? "bg-violet-100 text-violet-700"
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        size="icon"
                        className="h-7 w-7 bg-yellow-400 hover:bg-yellow-500 text-white"
                        title="Edit user"
                        onClick={() => setEditingUser(user)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        className="h-7 w-7 bg-red-500 hover:bg-red-600 text-white"
                        title="Delete user"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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
          Showing {filteredUsers.length > 0 ? startIndex + 1 : 0} -{" "}
          {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} of{" "}
          {filteredUsers.length}
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}
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
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent
          className="max-w-md"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Edit User
            </DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form className="space-y-4 mt-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  defaultValue={editingUser.name}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  defaultValue={editingUser.email}
                  className="mt-1.5"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
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
    </div>
  );
}
