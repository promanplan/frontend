import * as React from "react";

export function SimpleSlot({ children, ...props }: any) {
    return React.isValidElement(children)
        ? React.cloneElement(children, props)
        : children;
} 