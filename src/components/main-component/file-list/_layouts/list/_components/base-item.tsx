import { cn } from "@/lib/utils";

type Props = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  start?: React.ReactNode;
  end?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const BaseListItem = ({
  title,
  description,
  start,
  end,
  className,
  onClick,
}: Props) => (
  <div
    className={cn(
      "flex cursor-pointer items-center rounded p-4 transition-colors hover:bg-secondary/30",
      className
    )}
    onClick={onClick}
  >
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center justify-between space-x-4">
        <div className="flex size-5 items-center justify-center">{start}</div>
        <h4 className="w-[220px] flex-1 truncate text-[22px] font-medium lg:w-[320px]">
          {title}
        </h4>
        <p className="hidden items-end justify-end pr-4 text-xs opacity-75 sm:block">
          {description}
        </p>
      </div>

      {end && (
        <div
          className="flex size-5 items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {end}
        </div>
      )}
    </div>
  </div>
);
