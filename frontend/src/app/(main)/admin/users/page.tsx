"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Shield, Calendar, Mail, Phone, ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "ADMIN") return;

    setLoading(true);
    api
      .get("/admin/users", { params: { page, limit: 20, search } })
      .then((res) => {
        setUsers(res.data.users);
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading, page, search]);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse h-64 bg-muted rounded-xl" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold font-display mb-2">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
        <Button className="mt-6 rounded-full" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold font-display">Users</h1>
            <p className="text-sm text-muted-foreground">{total} total users</p>
          </div>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 rounded-full bg-muted/50 border-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-border/40 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Name</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Email</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Phone</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Role</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4 font-medium">{u.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{u.email}</td>
                    <td className="p-4 text-sm text-muted-foreground">{u.phone || "—"}</td>
                    <td className="p-4">
                      <Badge
                        variant={u.role === "ADMIN" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {users.map((u) => (
              <Card key={u.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{u.name}</h3>
                    <Badge
                      variant={u.role === "ADMIN" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {u.role}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {u.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {u.phone || "—"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(u.createdAt).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
