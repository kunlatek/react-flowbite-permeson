import { useMemo, useCallback } from "react";
import type { IFormCondition } from "@/models/form";

interface ITab {
  id: string;
  title: string;
  conditions?: IFormCondition[];
}

interface KuTabProps {
  tabs: ITab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  formState: Record<string, unknown>;
  conditions?: IFormCondition[];
}

export const KuTab = ({
  tabs,
  activeTabId,
  onTabChange,
  formState,
  conditions,
}: KuTabProps) => {
  const evaluateConditions = useCallback(
    (state: Record<string, unknown>, conds?: IFormCondition[]): boolean => {
      if (!conds || conds.length === 0) return true;

      for (const condition of conds) {
        if (condition.type === "form" && condition.elements) {
          let overallResult = true;
          let firstElement = true;

          for (const element of condition.elements) {
            const formValue = state[element.key];
            const elementValue = element.value;
            let currentResult = false;

            if (Array.isArray(formValue)) {
              const check = (item: unknown) => {
                if (
                  typeof item === "object" &&
                  item !== null &&
                  "value" in item
                ) {
                  return (item as { value: unknown }).value === elementValue;
                }
                return item === elementValue;
              };
              switch (element.comparisonOperator) {
                case "===":
                case "in":
                  currentResult = formValue.some(check);
                  break;
                case "!==":
                case "nin":
                  currentResult = !formValue.some(check);
                  break;
              }
            } else {
              if (
                elementValue === undefined &&
                !["in", "nin"].includes(element.comparisonOperator)
              ) {
                currentResult = false;
              } else {
                switch (element.comparisonOperator) {
                  case "===":
                    currentResult = formValue === elementValue;
                    break;
                  case "!==":
                    currentResult = formValue !== elementValue;
                    break;
                  case ">":
                    if (
                      (typeof formValue === "number" &&
                        typeof elementValue === "number") ||
                      (typeof formValue === "string" &&
                        typeof elementValue === "string")
                    ) {
                      currentResult = formValue > elementValue;
                    }
                    break;
                  case ">=":
                    if (
                      (typeof formValue === "number" &&
                        typeof elementValue === "number") ||
                      (typeof formValue === "string" &&
                        typeof elementValue === "string")
                    ) {
                      currentResult = formValue >= elementValue;
                    }
                    break;
                  case "<":
                    if (
                      (typeof formValue === "number" &&
                        typeof elementValue === "number") ||
                      (typeof formValue === "string" &&
                        typeof elementValue === "string")
                    ) {
                      currentResult = formValue < elementValue;
                    }
                    break;
                  case "<=":
                    if (
                      (typeof formValue === "number" &&
                        typeof elementValue === "number") ||
                      (typeof formValue === "string" &&
                        typeof elementValue === "string")
                    ) {
                      currentResult = formValue <= elementValue;
                    }
                    break;
                  case "in":
                    if (Array.isArray(elementValue)) {
                      currentResult = elementValue.includes(formValue);
                    }
                    break;
                  case "nin":
                    if (Array.isArray(elementValue)) {
                      currentResult = !elementValue.includes(formValue);
                    }
                    break;
                }
              }
            }

            if (firstElement) {
              overallResult = currentResult;
              firstElement = false;
            } else {
              if (element.logicalOperator === "||") {
                overallResult = overallResult || currentResult;
              } else {
                overallResult = overallResult && currentResult;
              }
            }
          }
          if (!overallResult) return false;
        }
      }
      return true;
    },
    []
  );

  const showComponent = useMemo(
    () => evaluateConditions(formState, conditions),
    [formState, conditions, evaluateConditions]
  );

  const visibleTabs = useMemo(
    () => tabs.filter((tab) => evaluateConditions(formState, tab.conditions)),
    [tabs, formState, evaluateConditions]
  );

  if (!showComponent) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        {visibleTabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const activeClasses =
            "text-blue-600 border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500";
          const inactiveClasses =
            "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";
          return (
            <li key={tab.id} className="mr-2">
              <button
                type="button"
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  isActive ? activeClasses : inactiveClasses
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.title}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
