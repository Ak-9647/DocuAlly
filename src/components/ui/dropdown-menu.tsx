import * as React from "react";

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export interface DropdownMenuTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ className, asChild = false, ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center ${className || ""}`}
      {...props}
    />
  )
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end" | "center";
  forceMount?: boolean;
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  className,
  align = "center",
  forceMount = false,
  children,
  ...props
}) => {
  return (
    <div
      className={`z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground ${
        className || ""
      }`}
      {...props}
    />
  )
);
DropdownMenuItem.displayName = "DropdownMenuItem";

export interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-2 py-1.5 text-sm font-semibold ${className || ""}`}
      {...props}
    />
  )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`-mx-1 my-1 h-px bg-muted ${className || ""}`}
      {...props}
    />
  )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
}; 