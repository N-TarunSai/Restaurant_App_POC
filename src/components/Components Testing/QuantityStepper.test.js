import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuantityStepper from "../QuantityStepper";

describe("QuantityStepper", () => {
  test("Renders with initial value", () => {
    render(<QuantityStepper value={5} onChange={() => {}} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test('Calls onChange with incremented value when "+" clicked', () => {
    const handleChange = jest.fn();
    render(<QuantityStepper value={5} onChange={handleChange} />);
    fireEvent.click(screen.getByRole("button", { name: /increase/i }));
    expect(handleChange).toHaveBeenCalledWith(6);
  });

  test("Does not increment above max", () => {
    const handleChange = jest.fn();
    render(<QuantityStepper value={20} onChange={handleChange} max={20} />);
    fireEvent.click(screen.getByRole("button", { name: /increase/i }));
    expect(handleChange).not.toHaveBeenCalled(); // button is disabled, should not fire
  });

  test("Disables increment button at max", () => {
    render(<QuantityStepper value={20} onChange={() => {}} max={20} />);
    expect(screen.getByRole("button", { name: /increase/i })).toBeDisabled();
  });

  test('Calls onChange with decremented value when "−" clicked', () => {
    const handleChange = jest.fn();
    render(<QuantityStepper value={5} onChange={handleChange} />);
    fireEvent.click(screen.getByRole("button", { name: /decrease/i }));
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  test("Does not decrement below min", () => {
    const handleChange = jest.fn();
    render(<QuantityStepper value={0} onChange={handleChange} min={0} />);
    fireEvent.click(screen.getByRole("button", { name: /decrease/i }));
    expect(handleChange).not.toHaveBeenCalled(); // button is disabled, should not fire
  });

  test("Disables decrement button at min", () => {
    render(<QuantityStepper value={0} onChange={() => {}} min={0} />);
    expect(screen.getByRole("button", { name: /decrease/i })).toBeDisabled();
  });

  test("Renders with custom aria-label", () => {
    render(
      <QuantityStepper
        value={3}
        onChange={() => {}}
        ariaLabel="Adjust quantity of Soup"
      />
    );
    expect(
      screen.getByRole("group", { name: "Adjust quantity of Soup" })
    ).toBeInTheDocument();
  });

});
