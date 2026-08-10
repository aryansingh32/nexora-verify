import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getHolder } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, Building2, Phone, Mail, Calendar, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/users/$id")({
  component: UserDetailPage,
});

function UserDetailPage() {
  const { id } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["holder", id],
    queryFn: () => getHolder({ data: { id } }),
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data?.holder) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4">User not found</h2>
        <Button asChild>
          <Link to="/admin/users">Back to Users</Link>
        </Button>
      </div>
    );
  }

  const { holder, certificates } = data;
  const initials = holder.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-3 mb-2 text-slate-500">
          <Link to="/admin/users">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Users
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            User Details
          </h1>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 border-2 border-slate-100 shadow-sm">
              <AvatarFallback className="text-2xl bg-primary/5 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {holder.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-slate-600 bg-slate-50">
                      {holder.holder_type}
                    </Badge>
                    <Badge
                      className={
                        holder.status === "active"
                          ? "bg-green-100 text-green-700 hover:bg-green-100 border-transparent shadow-none"
                          : "bg-slate-100 text-slate-600 border-transparent shadow-none"
                      }
                    >
                      {holder.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-4 border-t border-slate-100">
                <div className="flex items-center text-slate-600 gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {holder.email}
                </div>
                <div className="flex items-center text-slate-600 gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {holder.phone || "—"}
                </div>
                <div className="flex items-center text-slate-600 gap-2">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  {holder.organization || "—"}
                </div>
                <div className="flex items-center text-slate-600 gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Joined {format(new Date(holder.created_at), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Certificates ({certificates.length})
        </h3>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Certificate #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    No certificates found for this user.
                  </TableCell>
                </TableRow>
              ) : (
                certificates.map((cert: any) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-mono text-xs text-slate-600">
                      {cert.certificate_number}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {cert.title}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {cert.cert_type}
                    </TableCell>
                    <TableCell className="text-slate-600 whitespace-nowrap">
                      {format(new Date(cert.issued_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          cert.status === "valid"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-transparent"
                            : "bg-red-100 text-red-700 hover:bg-red-100 border-transparent"
                        }
                      >
                        {cert.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/admin/certificates/$id" params={{ id: cert.id }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
