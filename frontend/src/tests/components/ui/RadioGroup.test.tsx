// RadioGroup.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { RadioGroup } from "../../../components/ui/RadioGroup";

const MockIcon = (props: any) => <svg {...props}><circle /></svg>;

describe("RadioGroup", () => {
  const options = [
    { value: "opt1", label: "Option 1", icon: MockIcon },
    { value: "opt2", label: "Option 2", icon: MockIcon },
  ];
  const onChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("рендерит все опции", () => {
    render(<RadioGroup options={options} selected="opt1" onChange={onChange} />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("подсвечивает выбранную опцию", () => {
    render(<RadioGroup options={options} selected="opt1" onChange={onChange} />);
    const btn1 = screen.getByRole("button", { name: /Option 1/i });
    const btn2 = screen.getByRole("button", { name: /Option 2/i });

    expect(btn1).toHaveClass("bg-blue-100");
    expect(btn2).toHaveClass("bg-white");
  });

  it("вызывает onChange при клике на кнопку", async () => {
    render(<RadioGroup options={options} selected="opt1" onChange={onChange} />);
    const btn2 = screen.getByRole("button", { name: /Option 2/i });
    await userEvent.click(btn2);
    expect(onChange).toHaveBeenCalledWith("opt2");
  });

  it("ориентация horizontal применяет класс flex gap-6.5", () => {
    const { container } = render(
      <RadioGroup
        options={options}
        selected="opt1"
        onChange={onChange}
        orientation="horizontal"
      />
    );
    expect(container.firstChild).toHaveClass("flex", "gap-6.5");
  });

  it("ориентация vertical применяет класс space-y-1", () => {
    const { container } = render(
      <RadioGroup
        options={options}
        selected="opt1"
        onChange={onChange}
        orientation="vertical"
      />
    );
    expect(container.firstChild).toHaveClass("space-y-1");
  });
});