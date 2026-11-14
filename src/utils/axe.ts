import type { AxeResults } from "axe-core";

const DEBOUNCE_MS = 1000;

const logViolations = ({ violations }: AxeResults) => {
  if (violations.length === 0) return;

  console.groupCollapsed(
    `%caxe: ${violations.length} accessibility violation(s)`,
    "color: #b91c1c; font-weight: bold",
  );
  violations.forEach(({ id, impact, help, helpUrl, nodes }) => {
    console.groupCollapsed(`[${impact}] ${id}: ${help}`);
    console.log(helpUrl);
    nodes.forEach((node) => console.log(node.target.join(" "), node.html));
    console.groupEnd();
  });
  console.groupEnd();
};

/**
 * Runs axe-core against the document and logs violations to the console.
 * Re-runs (debounced) whenever the DOM changes, e.g. on route changes.
 * Intended for development only.
 */
export const initAxe = async (): Promise<void> => {
  const { default: axe } = await import("axe-core");

  let timer: number | undefined;
  const run = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      axe.run(document).then(logViolations).catch(console.error);
    }, DEBOUNCE_MS);
  };

  new MutationObserver(run).observe(document.body, {
    childList: true,
    subtree: true,
  });
  run();
};
