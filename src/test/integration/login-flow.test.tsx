import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import Login from "@/pages/Login";
import { SUPER_ADMIN_CREDENTIALS } from "@/lib/auth";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("login flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
    navigateMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
  });

  it("stores the session and navigates to /mapa on valid credentials", async () => {
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("superadmin o superadmin@sigocana.local"), {
      target: { value: SUPER_ADMIN_CREDENTIALS.username },
    });

    const passwordInput = document.querySelector('input[type="password"]');
    if (!passwordInput) {
      throw new Error("No password input was rendered");
    }

    fireEvent.change(passwordInput, { target: { value: SUPER_ADMIN_CREDENTIALS.password } });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar al sistema" }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700);
    });

    expect(window.localStorage.getItem("sigocana.auth.session")).toContain(SUPER_ADMIN_CREDENTIALS.email);
    expect(navigateMock).toHaveBeenCalledWith("/mapa", { replace: true });
  });
});
