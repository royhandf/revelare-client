"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen, BookX, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {
  bookmarkService,
  BookmarkItem,
  UnauthorizedError,
} from "@/lib/services/book";
import { toast } from "sonner";
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

function BookCoverImage({ src, alt }: { src: string | null; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-100 to-violet-200 rounded-md">
        <BookOpen className="h-16 w-16 text-violet-400 mb-2" />
        <span className="text-xs text-violet-500 text-center px-2">
          No Cover
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={267}
      className="max-h-full w-auto drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
      onError={() => setHasError(true)}
    />
  );
}

export default function BookmarkPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingBookmark, setDeletingBookmark] = useState<BookmarkItem | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    const fetchBookmarks = async () => {
      if (!session?.user?.accessToken || !session?.user?.id) return;

      setIsLoading(true);
      try {
        const response = await bookmarkService.getByUser(
          session.user.accessToken,
          Number(session.user.id)
        );
        setBookmarks(response.data);
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          signOut({ callbackUrl: "/signin" });
          return;
        }
        toast.error("Failed to load bookmarks");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchBookmarks();
    }
  }, [session, status, router]);

  const handleDelete = async () => {
    if (!session?.user?.accessToken || !deletingBookmark) return;

    setIsDeleting(true);
    try {
      await bookmarkService.delete(
        session.user.accessToken,
        deletingBookmark.id
      );
      setBookmarks((prev) => prev.filter((b) => b.id !== deletingBookmark.id));
      toast.success("Bookmark removed");
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        signOut({ callbackUrl: "/signin" });
        return;
      }
      toast.error("Failed to remove bookmark");
    } finally {
      setIsDeleting(false);
      setDeletingBookmark(null);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {bookmarks.length} book{bookmarks.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mb-5">
              <BookX className="h-10 w-10 text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No bookmarks yet
            </h3>
            <p className="text-gray-500 max-w-sm mb-6">
              Save your favorite books to find them easily later.
            </p>
            <Link href="/">
              <Button className="bg-violet-600 hover:bg-violet-700 px-6">
                Explore Books
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {bookmarks.map((bookmark) => (
              <Card
                key={bookmark.id}
                className="h-full overflow-hidden border border-gray-200 hover:border-violet-400 hover:shadow-lg transition-all group relative"
              >
                {/* Clean floating X - corner badge */}
                <button
                  onClick={() => setDeletingBookmark(bookmark)}
                  className="absolute top-0 right-0 z-10 w-9 h-9 bg-white/90 hover:bg-red-50 rounded-bl-xl flex items-center justify-center transition-colors border-l border-b border-gray-200"
                >
                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                </button>

                <Link href={`/book/${bookmark.book_id}`} className="block">
                  <div className="h-56 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-3">
                    <BookCoverImage
                      src={bookmark.book_cover}
                      alt={bookmark.book_title || "Book"}
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 min-h-[40px] group-hover:text-violet-600 transition-colors">
                      {bookmark.book_title || "Untitled"}
                    </h3>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AlertDialog
        open={!!deletingBookmark}
        onOpenChange={(open) => !open && setDeletingBookmark(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Bookmark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &quot;
              {deletingBookmark?.book_title}
              &quot; from your bookmarks?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
