export class AdminUserRow {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string | null;
  isactive?: boolean;

  constructor(params: { id: string; username: string; email: string | null; name: string; role: string | null; isactive?: boolean }) {
    this.id = params.id;
    this.username = params.username;
    this.email = params.email ?? "";
    this.name = params.name;
    this.role = params.role;
    this.isactive = params.isactive;
  }

  static fromApi(json: AdminUserRow): AdminUserRow {
    return new AdminUserRow({
      id: String(json?.id ?? ""),
      username: String(json?.username ?? ""),
      email: json?.email ?? null,
      name: String(json?.name ?? ""),
      role: (json?.role ?? null) as string | null,
      isactive: json?.isactive,
    });
  }
}


