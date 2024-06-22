import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

/**
 * Renders a button component.
 *
 * @param props - The props for the button component.
 * @returns The rendered button element.
 */
export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class="px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors"
    />
  );
}
