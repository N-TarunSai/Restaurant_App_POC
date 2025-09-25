import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header"; // Adjust the path if needed

describe("Header Component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  });

  test("Renders the brand name", () => {
    const brand = screen.getByLabelText(/go to homepage/i);
    expect(brand).toBeInTheDocument();
    expect(brand).toHaveTextContent(/ABC Multi Cuisine/i);
  });

  test("Renders the navigation links", () => {
    expect(
      screen.getByRole("link", { name: /view menu/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /book a table/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /order online/i })
    ).toBeInTheDocument();
  });

  test("Renders the order button inside link", () => {
    const orderLink = screen.getByRole("link", { name: /order online/i });
    const button = screen.getByRole("button", { name: /order online/i });

    expect(orderLink).toContainElement(button);
  });
});
