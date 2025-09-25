import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../Home";
import { MENU } from "../../data/menu";

// Mock MenuCarousel 
jest.mock("../../components/MenuCarousel", () => () => (
  <div>Menu Carousel Placeholder</div>
));

describe("Home Page", () => {
  test("Renders MenuCarousel component", () => {
    render(<Home />);
    expect(screen.getByText(/Menu Carousel Placeholder/i)).toBeInTheDocument();
  });

  test("Renders MENU section", () => {
    render(<Home />);
    expect(screen.getByLabelText("Menu Items")).toBeInTheDocument();
  });
});
