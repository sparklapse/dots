export const getScrollableParent = (target?: HTMLElement | null): HTMLElement | null => {
  target = target?.parentElement;
  if (!target) return null;

  if (target.scrollHeight > target.clientHeight) return target;
  return getScrollableParent(target);
};
