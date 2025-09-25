// MenuList.test.jsx
import { render, screen } from "@testing-library/react";
import MenuList from "../MenuList";
import { MENU, SECTIONS } from "../../data/menu";
import React from "react";

describe("MenuList Component", () => {
  test("renders menu section with heading", () => {
    render(<MenuList items={MENU} />);
    expect(screen.getByRole("heading", { name: /menu/i })).toBeInTheDocument();
  });

  test("Renders all defined sections", () => {
    render(<MenuList items={MENU} />);
    SECTIONS.forEach((section) => {
      expect(
        screen.getByRole("heading", { name: new RegExp(section, "i") })
      ).toBeInTheDocument();
    });
  });

  test("Renders items under correct section", () => {
    render(<MenuList items={MENU} />);
    expect(screen.getByText("Soup of the Day")).toBeInTheDocument();
    expect(screen.getByText("Rosemary Chicken")).toBeInTheDocument();
    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    expect(screen.getByText("Cold Coffee")).toBeInTheDocument();
  });

  test("Renders veg/non-veg dot with correct aria-labels", () => {
    render(<MenuList items={MENU} />);
    expect(screen.getAllByLabelText("Vegetarian").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Non-Vegetarian").length).toBeGreaterThan(
      0
    );
  });

  test("Renders item descriptions", () => {
    render(<MenuList items={MENU} />);
    expect(screen.getByText(/Chef’s choice fresh soup./i)).toBeInTheDocument();
    expect(screen.getByText(/Herb jus, garlic mash./i)).toBeInTheDocument();
  });

  test("Renders images only when showImages is true", () => {
    const { rerender } = render(<MenuList items={MENU} showImages={false} />);
    expect(screen.queryByAltText("Soup of the Day")).not.toBeInTheDocument();

    rerender(<MenuList items={MENU} showImages={true} />);
    expect(screen.getByAltText("Soup of the Day")).toBeInTheDocument();
    expect(screen.getByAltText("Rosemary Chicken")).toBeInTheDocument();
  });

  test("Calls controlsRenderer for each item", () => {
    const mockRenderer = jest.fn((item) => <button>+ {item.name}</button>);
    render(<MenuList items={MENU} controlsRenderer={mockRenderer} />);
    expect(mockRenderer).toHaveBeenCalledTimes(MENU.length);
    // check a sample rendered button
    expect(
      screen.getByRole("button", { name: "+ Soup of the Day" })
    ).toBeInTheDocument();
  });

  test("Each item has correct aria-label with details", () => {
    render(<MenuList items={MENU} />);
    expect(
      screen.getByLabelText("Dish: Soup of the Day, veg, Price: ₹199")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Dish: Rosemary Chicken, non-veg, Price: ₹449")
    ).toBeInTheDocument();
  });
});
