import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";

interface TestProps {
  keyValue: string;
  initialValue: string;
}

// Test component that renders the hook
export const TestComponent: React.FC<TestProps> = ({ keyValue, initialValue }) => {
  const [value, setValue] = useLocalStorage<string>(keyValue, initialValue);
  return (
    <div>
      <button data-testid="get-button" onClick={() => console.log(value)}>
        Get Value
      </button>
      <button data-testid="set-button" onClick={() => setValue("new value")}>
        Set Value
      </button>
    </div>
  );
};
