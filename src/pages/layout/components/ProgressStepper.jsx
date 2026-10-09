import Card from "@components/Card";
import { HelperText } from "@components/Typography";

const nodeStates = {
  default: "border-gray-400 text-gray-600 hover:bg-gray-50",
  active: "border-brand bg-brand font-semibold text-white",
  done: "border-green-600 bg-green-600 text-white",
};

const StepNode = ({ number, state, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={state === "active" ? "step" : undefined}
      className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${nodeStates[state]}`}
    >
      {number}
    </button>
  );
};

const StepConnector = () => {
  return <span className="h-px w-4 bg-gray-700" aria-hidden="true" />;
};

// Node dan garis penghubung dipisah supaya bisa flex-wrap per item.
const StepperItem = ({ number, state, isLast, onSelect }) => {
  return (
    <li className="flex items-center">
      <StepNode
        number={number}
        state={state}
        onClick={() => onSelect(number)}
      />
      {!isLast && <StepConnector />}
    </li>
  );
};

const ProgressStepper = ({ total, current, isDone, onSelect }) => {
  return (
    <Card as="nav" aria-label="Progress Pages" className="px-5 py-4">
      <HelperText>Progress Pages</HelperText>
      <ol className="mt-3 flex flex-wrap items-center gap-y-2">
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const state =
            n === current ? "active" : isDone(n) ? "done" : "default";
          return (
            <StepperItem
              key={n}
              number={n}
              state={state}
              isLast={n === total}
              onSelect={onSelect}
            />
          );
        })}
      </ol>
    </Card>
  );
};

export default ProgressStepper;
