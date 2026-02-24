"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteUserDialog } from "@/components/admin/delete-user-dialog";
import { AlertCircle, RotateCcw } from "lucide-react";

interface UserDetail {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

interface UserProfile {
  privacy_accepted_at: string;
  terms_accepted_at: string;
  marketing_consent: boolean;
  marketing_consent_at: string | null;
}

interface UserAnalisi {
  id: string;
  stato: string;
  semaforo: string | null;
  file_type: string;
  numero_anomalie: number;
  created_at: string;
}

const SEMAFORO_COLORS: Record<string, string> = {
  verde: "bg-green-500",
  giallo: "bg-yellow-400",
  rosso: "bg-red-500",
};

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analisi, setAnalisi] = useState<UserAnalisi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(false);
    fetch(`/api/admin/users/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setUser(data.user);
        setProfile(data.profile);
        setAnalisi(data.analisi);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function formatDate(iso: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">
          {error ? "Errore nel caricamento" : "Utente non trovato"}
        </h2>
        <div className="flex gap-3 mt-4">
          {error && (
            <Button variant="outline" onClick={fetchData}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Riprova
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/utenti")}
          >
            Torna alla lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/utenti")}
            className="mb-2"
          >
            &larr; Torna alla lista
          </Button>
          <h1 className="text-2xl font-bold">{user.email}</h1>
        </div>
        <DeleteUserDialog
          userId={user.id}
          userEmail={user.email}
          onDeleted={() => router.push("/admin/utenti")}
        />
      </div>

      {/* Info utente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Registrato il</span>
              <span>{formatDate(user.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ultimo accesso</span>
              <span>{formatDate(user.last_sign_in_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Analisi totali</span>
              <Badge variant="outline">{analisi.length}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Consensi GDPR */}
        <Card>
          <CardHeader>
            <CardTitle>Consensi GDPR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Privacy Policy</span>
              <span className="text-green-600">
                {formatDate(profile?.privacy_accepted_at ?? null)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Termini di Servizio
              </span>
              <span className="text-green-600">
                {formatDate(profile?.terms_accepted_at ?? null)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Marketing</span>
              <span>
                {profile?.marketing_consent ? (
                  <Badge className="bg-green-100 text-green-800">
                    S&igrave; — {formatDate(profile.marketing_consent_at)}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">No</span>
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Analisi dell'utente */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Analisi ({analisi.length})
        </h2>
        {analisi.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nessuna analisi effettuata
          </p>
        ) : (
          <div className="space-y-2">
            {analisi.map((a) => (
              <Link
                key={a.id}
                href={`/admin/analisi/${a.id}`}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {a.semaforo && (
                    <span
                      className={`inline-block h-3 w-3 rounded-full ${
                        SEMAFORO_COLORS[a.semaforo] || ""
                      }`}
                    />
                  )}
                  <span className="font-mono text-xs text-muted-foreground">
                    {a.id.substring(0, 8)}
                  </span>
                  <Badge variant="outline">{a.file_type}</Badge>
                  <Badge variant="secondary">{a.stato}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDate(a.created_at)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* ID tecnico */}
      <div className="text-xs text-muted-foreground">
        <div>User ID: {user.id}</div>
      </div>
    </div>
  );
}
