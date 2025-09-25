// Footer.test.jsx
import { render, screen } from "@testing-library/react";
import Footer from "../Footer";
import React from "react";

describe("Footer Component", () => {
  test("Renders Hours section with correct text", () => {
    render(<Footer />);
    expect(screen.getByRole("heading", { name: /hours/i })).toBeInTheDocument();
    expect(screen.getByText(/Mon - Fri: 11am - 10pm/i)).toBeInTheDocument();
    expect(screen.getByText(/Sat - Sun: 11am - 12am/i)).toBeInTheDocument();
  });

  test("Renders Address section with correct text", () => {
    render(<Footer />);
    expect(
      screen.getByRole("heading", { name: /address/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Opp\. DLF Gate 3, Gachibowli, Hyderabad/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Telangana - 500032/i)).toBeInTheDocument();
  });

  test("Renders Follow Us section", () => {
    render(<Footer />);
    expect(
      screen.getByRole("heading", { name: /follow us/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Facebook • Instagram/i)).toBeInTheDocument();
  });

  test("Renders copyright text", () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2025 ABC Multi Cuisine Restaurant/i)
    ).toBeInTheDocument();
  });

});
