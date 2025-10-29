import { Button as FlowbiteButton, Spinner } from "flowbite-react";
import { cn } from "@/utils/cn";
import { Link } from "react-router-dom";
import { IKuButtonProps, buttonVariants } from "@/interfaces/ku-components";

export const KuButton = (props: IKuButtonProps) => {
  const { label, actionType = "submit", variant, size, isDisabled = false, customClass = "", children, href, loading = false, onClick } = props;

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
      {loading && <Spinner className="mr-3" size="sm" />}
      {children || label}
    </>
  );

  const buttonClasses = cn(
    buttonVariants({ variant, size, className: customClass })
  );

  if (href) {
    return (
      <Link to={href} className={buttonClasses}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <FlowbiteButton
      disabled={finalIsDisabled}
      className={buttonClasses}
      type={getButtonType()}
      onClick={onClick}
    >
      {buttonContent}
    </FlowbiteButton>
  );
};
