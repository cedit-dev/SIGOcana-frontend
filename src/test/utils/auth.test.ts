import { beforeEach, describe, expect, it } from "vitest";
import {
  SUPER_ADMIN_CREDENTIALS,
  authenticate,
  clearStoredSession,
  getStoredSession,
  isSuperAdmin,
  storeSession,
} from "@/lib/auth";

describe("auth helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("authenticates the super admin with username or email", () => {
    const byUsername = authenticate(SUPER_ADMIN_CREDENTIALS.username, SUPER_ADMIN_CREDENTIALS.password);
    const byEmail = authenticate(SUPER_ADMIN_CREDENTIALS.email, SUPER_ADMIN_CREDENTIALS.password);

    expect(byUsername).toEqual(byEmail);
    expect(byUsername).toMatchObject({
      email: SUPER_ADMIN_CREDENTIALS.email,
      name: SUPER_ADMIN_CREDENTIALS.name,
      role: "super_admin",
    });
  });

  it("rejects invalid credentials", () => {
    expect(authenticate("unknown", "bad-password")).toBeNull();
    expect(authenticate(SUPER_ADMIN_CREDENTIALS.username, "bad-password")).toBeNull();
  });

  it("persists and clears sessions from localStorage", () => {
    const session = authenticate(SUPER_ADMIN_CREDENTIALS.username, SUPER_ADMIN_CREDENTIALS.password);
    expect(session).not.toBeNull();

    storeSession(session!);
    expect(getStoredSession()).toEqual(session);

    clearStoredSession();
    expect(getStoredSession()).toBeNull();
  });

  it("detects super admin sessions", () => {
    expect(isSuperAdmin(null)).toBe(false);
    expect(
      isSuperAdmin({
        email: SUPER_ADMIN_CREDENTIALS.email,
        name: SUPER_ADMIN_CREDENTIALS.name,
        role: "super_admin",
      }),
    ).toBe(true);
  });
});
