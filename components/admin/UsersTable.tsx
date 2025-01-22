// components/admin/UsersTable.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Ban, CheckCircle } from "lucide-react";
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

interface UserProfile {
  id: number;
  supabaseUserId: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  isBlocked: boolean;
  createdAt: string;
}

export function UsersTable() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleBlockToggle = async (user: UserProfile) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBlocked: !user.isBlocked }),
      });

      if (response.ok) {
        setUsers(
          users.map((u) =>
            u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u
          )
        );
        setBlockDialogOpen(false);
      }
    } catch (error) {
      console.error("Error toggling user block status:", error);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isBlocked
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="neutral"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setBlockDialogOpen(true);
                    }}
                  >
                    {user.isBlocked ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Unblock
                      </>
                    ) : (
                      <>
                        <Ban className="h-4 w-4 mr-2" />
                        Block
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.isBlocked ? "Unblock" : "Block"} User
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.isBlocked
                ? "This will allow the user to access the platform again."
                : "This will prevent the user from accessing the platform."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedUser && handleBlockToggle(selectedUser)}
              className={
                selectedUser?.isBlocked ? "" : "bg-red-600 hover:bg-red-700"
              }
            >
              {selectedUser?.isBlocked ? "Unblock" : "Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
