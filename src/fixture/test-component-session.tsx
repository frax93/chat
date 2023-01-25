import useSessionStorage from "hooks/useSessionStorage";
import React from "react";

interface TestProps {
  keyValue: string;
  initialValue: string;
}

// Test component that renders the hook
export const TestComponent: React.FC<TestProps> = ({ keyValue, initialValue }) => {
  const [value, setValue] = useSessionStorage<string>(keyValue, initialValue);
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
