import React from "react";
import { render, screen } from "@testing-library/react";
import NotFound from "../NotFound";

describe("NotFound Page", () => {
  test("Renders Not Found title", () => {
    render(<NotFound />);
    expect(screen.getByText(/Not Found/i)).toBeInTheDocument();
  });
});
