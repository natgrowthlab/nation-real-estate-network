import { AuthorizationError, assertCan, type Capability } from "../../domain/auth/permissions";
import { currentUser } from "./current-user";

export class AuthenticationError extends Error { readonly statusCode = 401; }

export async function requireUser(capability?: Capability) {
  const user = await currentUser();
  if (!user) throw new AuthenticationError("Debes iniciar sesión.");
  if (capability) assertCan(user.role, capability);
  return user;
}

export function authorizationResponse(error: unknown) {
  if (error instanceof AuthenticationError) return { status: error.statusCode, message: error.message };
  if (error instanceof AuthorizationError) return { status: error.statusCode, message: "No tienes permiso para realizar esta acción." };
  return null;
}
