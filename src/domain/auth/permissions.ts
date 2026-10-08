export type Role = "SUPER_ADMIN" | "OPERATIONS_ADMIN" | "COMMERCIAL_MANAGER" | "SELLER" | "FINANCE" | "COMPLIANCE";

export type Capability =
  | "property:create" | "property:read" | "property:publish" | "property:read_sensitive"
  | "owner:read" | "owner:manage" | "lead:create" | "lead:read_own" | "lead:read_all"
  | "appointment:manage" | "offer:manage" | "deal:manage" | "commission:read_own"
  | "commission:approve" | "audit:read";

const permissions: Record<Role, readonly Capability[]> = {
  SUPER_ADMIN: ["property:create", "property:read", "property:publish", "property:read_sensitive", "owner:read", "owner:manage", "lead:create", "lead:read_own", "lead:read_all", "appointment:manage", "offer:manage", "deal:manage", "commission:read_own", "commission:approve", "audit:read"],
  OPERATIONS_ADMIN: ["property:create", "property:read", "property:publish", "property:read_sensitive", "owner:read", "owner:manage", "lead:create", "lead:read_all", "appointment:manage", "offer:manage", "deal:manage", "audit:read"],
  COMMERCIAL_MANAGER: ["property:read", "lead:create", "lead:read_own", "lead:read_all", "appointment:manage", "offer:manage", "deal:manage", "commission:read_own"],
  SELLER: ["property:read", "lead:create", "lead:read_own", "commission:read_own"],
  FINANCE: ["property:read", "commission:approve", "audit:read"],
  COMPLIANCE: ["property:read", "owner:read", "audit:read"],
};

export function can(role: Role, capability: Capability): boolean {
  return permissions[role].includes(capability);
}

export function assertCan(role: Role, capability: Capability): void {
  if (!can(role, capability)) throw new AuthorizationError(role, capability);
}

export class AuthorizationError extends Error {
  readonly statusCode = 403;
  constructor(role: Role, capability: Capability) {
    super(`El rol ${role} no tiene permiso para ${capability}.`);
    this.name = "AuthorizationError";
  }
}
