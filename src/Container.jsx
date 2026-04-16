export default function Container({
  defaultClassName = "container",
  className = "",
  as = "main",
  ...rest
}) {
  const As = as;

  const classNames = [defaultClassName, className].filter(Boolean).join(" ");

  return <As className={classNames} {...rest}></As>;
}

function SubContainer({
  defaultClassName = "my-3 p-3 bg-body rounded shadow-sm",
  className = "",
  as = "div",
  ...rest
}) {
  const As = as;

  const classNames = [defaultClassName, className].filter(Boolean).join(" ");

  return <As className={classNames} {...rest}></As>;
}

Container.SubContainer = SubContainer;
