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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const usersData = [
  {
    id: 1,
    name: "Royhan Daffa",
    email: "admin@semantic-book.co.id",
    role: "admin",
    registeredDate: "27 Oct 2024",
  },
  {
    id: 2,
    name: "Daffa New",
    email: "daffa@gmail.com",
    role: "user",
    registeredDate: "27 May 2025",
  },
];

type User = (typeof usersData)[0];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = usersData.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Daftar User</h1>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Cari pengguna..."
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
                NAMA
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                EMAIL
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                ROLE
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                TANGGAL DAFTAR
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-center">
                AKSI
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-10 w-10 text-gray-300" />
                    <p className="text-gray-500">
                      Tidak ada pengguna ditemukan
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user, index) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {index + 1}
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
                    {user.registeredDate}
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
          Showing {filteredUsers.length > 0 ? "1" : "0"} -{" "}
          {filteredUsers.length} of {usersData.length}
        </div>
        <Pagination className="w-auto mx-0 justify-end">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className="h-8 text-sm cursor-not-allowed opacity-50"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive
                className="h-8 w-8 text-sm bg-violet-600 text-white hover:bg-violet-700 border-violet-600"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                className="h-8 text-sm cursor-not-allowed opacity-50"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
                <Label htmlFor="edit-name">Nama</Label>
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
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
