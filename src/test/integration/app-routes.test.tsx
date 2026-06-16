import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "@/App";
import { MemoryRouter } from "react-router-dom";
import Landing from "@/pages/Landing";

vi.mock("@/components/Particles", () => ({
  default: () => <div data-testid="particles-stub" />,
}));

function renderAt(path: string) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

describe("app routes", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the landing page at /", async () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Abrir Mapa" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Conocer más" })).toBeInTheDocument();
  });

  it("renders the login page at /login", async () => {
    renderAt("/login");

    expect(await screen.findByRole("button", { name: "Ingresar al sistema" })).toBeInTheDocument();
    expect(screen.getByText("Iniciar Sesion")).toBeInTheDocument();
  });

  it("renders the not found page for unknown routes", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    renderAt("/ruta-inexistente");

    expect(await screen.findByText("404")).toBeInTheDocument();
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  });
});
