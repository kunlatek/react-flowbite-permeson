import { Button as FlowbiteButton } from "flowbite-react";
import { cn } from "@/utils/cn";
import { Link } from "react-router-dom";
import { IKuButtonProps, buttonVariants } from "@/interfaces/ku-components";

export const KuButton = (props: IKuButtonProps) => {
  const { id, testId, label, actionType = "submit", variant, size, isDisabled = false, customClass = "", children, href, loading = false, onClick } = props;

  const getButtonType = (): "submit" | "reset" | "button" => {
    switch (actionType) {
      case "submit":
      case "reset":
        return actionType;
      default:
        return "button";
    }
  };

  const finalIsDisabled = isDisabled || loading;
  const buttonContent = (
    <>
      {children || label}
    </>
  );

  const buttonClasses = cn(
    buttonVariants({ variant, size, className: customClass })
  );

  if (href) {
    return (
      <Link to={href} className={buttonClasses} id={id} data-testid={testId}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <FlowbiteButton
      id={id}
      data-testid={testId}
      disabled={finalIsDisabled}
      className={buttonClasses}
      type={getButtonType()}
      onClick={onClick}
      size="sm"
    >
      {buttonContent}
    </FlowbiteButton>
  );
};
