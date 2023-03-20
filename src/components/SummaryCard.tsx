import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";

type SummaryCardProps = {
  color: "light" | "dark";
  heading: string;
  value: string;
  trend?: "up" | "down";
  description?: string;
  onClick?: (e: any) => {};
};

function SummaryCard(props: SummaryCardProps) {
  return (
    <div
      className={` ${
        props.color === "light"
          ? "bg-gray-100 text-black"
          : "bg-gray-900 text-gray-100"
      } relative flex flex-col space-y-4 p-6 rounded-2xl transition-all duration-300 ease-in-out hover:scale-105`}
    >
      <span className="text-sm font-semibold">{props.heading}</span>
      <span className="text-5xl font-black">{props.value}</span>
      <div className="absolute top-0 right-6">
        {props.trend === "up" ? (
          <ArrowTrendingUpIcon className="w-28 h-28 text-gray-200" />
        ) : (
          <ArrowTrendingDownIcon className="w-28 h-28 text-gray-200" />
        )}
      </div>
      <span className="text-xs">{props.description}</span>
    </div>
  );
}

SummaryCard.propTypes = {};

export default SummaryCard;
