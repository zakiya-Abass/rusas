type ButtonProps = {
  color: string;
  disabled: boolean;
  isLoading: boolean;
  cta: string;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: (e: any) => void;
  size?: string;
};

export default function Button(props: ButtonProps) {
  return (
    <>
      {props.disabled ? (
        <button
          disabled={props.disabled}
          className="w-full rounded-md px-4 py-3 text-sm font-medium bg-gray-200 text-gray-400 cursor-not-allowed transition-colors duration-200 ease-in-out"
        >
          {props.isLoading ? (
            <span className="loader"></span>
          ) : (
            <span> {props.cta}</span>
          )}
        </button>
      ) : (
        <button
          type={props.type || "submit"}
          disabled={props.disabled}
          onClick={props.onClick}
          className="flex justify-center items-center w-full rounded-md px-4 py-3 text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-200 ease-in-out"
        >
          {props.isLoading ? (
            <span className="loader"></span>
          ) : (
            <span> {props.cta}</span>
          )}
        </button>
      )}
    </>
  );
}
