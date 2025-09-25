import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "../../slices/filtersSlice";
import Filters from "../Filters";
import { Provider } from "react-redux";
import { render, screen, fireEvent } from "@testing-library/react";

describe("Filters Component", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        filters: filtersReducer,
      },
      preloadedState: {
        filters: {
          query: "",
          veg: "all",
        },
      },
    });
  });

  const renderWithProvider = (ui) =>
    render(<Provider store={store}>{ui}</Provider>);

  test("Renders with default state (empty query & veg = all)", () => {
    renderWithProvider(<Filters />);

    const searchInput = screen.getByPlaceholderText(/search dishes/i);
    expect(searchInput).toHaveValue("");

    const vegCheckbox = screen.getByLabelText(/show only vegetarian dishes/i);
    const nonVegCheckbox = screen.getByLabelText(
      /show only non-vegetarian dishes/i
    );

    expect(vegCheckbox).not.toBeChecked();
    expect(nonVegCheckbox).not.toBeChecked();
    expect(store.getState().filters).toEqual({ query: "", veg: "all" });
  });

  test("Renders search bar and updates query on typing", () => {
    renderWithProvider(<Filters />);

    const searchInput = screen.getByPlaceholderText(/search dishes/i);
    fireEvent.change(searchInput, { target: { value: "pizza" } });

    expect(searchInput).toHaveValue("pizza");
    expect(store.getState().filters.query).toBe("pizza");
  });

  test("Supports multiple query changes", () => {
    renderWithProvider(<Filters />);

    const searchInput = screen.getByPlaceholderText(/search dishes/i);

    fireEvent.change(searchInput, { target: { value: "pasta" } });
    expect(store.getState().filters.query).toBe("pasta");

    fireEvent.change(searchInput, { target: { value: "burger" } });
    expect(store.getState().filters.query).toBe("burger");
  });

  test("Toggles veg filter On and Off", () => {
    renderWithProvider(<Filters />);

    const vegCheckbox = screen.getByLabelText(/show only vegetarian dishes/i);

    fireEvent.click(vegCheckbox);
    expect(vegCheckbox).toBeChecked();
    expect(store.getState().filters.veg).toBe("veg");

    fireEvent.click(vegCheckbox);
    expect(vegCheckbox).not.toBeChecked();
    expect(store.getState().filters.veg).toBe("all");
  });

  test("Toggles non-veg filter On and Off", () => {
    renderWithProvider(<Filters />);

    const nonVegCheckbox = screen.getByLabelText(
      /show only non-vegetarian dishes/i
    );

    fireEvent.click(nonVegCheckbox);
    expect(nonVegCheckbox).toBeChecked();
    expect(store.getState().filters.veg).toBe("non-veg");

    fireEvent.click(nonVegCheckbox);
    expect(nonVegCheckbox).not.toBeChecked();
    expect(store.getState().filters.veg).toBe("all");
  });

  test("Switches from veg to non-veg correctly", () => {
    renderWithProvider(<Filters />);

    const vegCheckbox = screen.getByLabelText(/show only vegetarian dishes/i);
    const nonVegCheckbox = screen.getByLabelText(
      /show only non-vegetarian dishes/i
    );

    fireEvent.click(vegCheckbox);
    expect(store.getState().filters.veg).toBe("veg");
    expect(vegCheckbox).toBeChecked();

    fireEvent.click(nonVegCheckbox);
    expect(store.getState().filters.veg).toBe("non-veg");
    expect(nonVegCheckbox).toBeChecked();
    expect(vegCheckbox).not.toBeChecked();
  });

  test("Switches from non-veg to veg correctly", () => {
    renderWithProvider(<Filters />);

    const vegCheckbox = screen.getByLabelText(/show only vegetarian dishes/i);
    const nonVegCheckbox = screen.getByLabelText(
      /show only non-vegetarian dishes/i
    );

    fireEvent.click(nonVegCheckbox);
    expect(store.getState().filters.veg).toBe("non-veg");
    expect(nonVegCheckbox).toBeChecked();

    fireEvent.click(vegCheckbox);
    expect(store.getState().filters.veg).toBe("veg");
    expect(vegCheckbox).toBeChecked();
    expect(nonVegCheckbox).not.toBeChecked();
  });
});
