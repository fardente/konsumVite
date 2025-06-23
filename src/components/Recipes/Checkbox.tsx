import React from 'react';

export default function Checkbox({
  initial,
  value,
  name,
  disabled,
}: {
  initial: boolean;
  value: string;
  name: string;
  disabled?: boolean;
}) {
  const [checked, setChecked] = React.useState(initial);

  return (
    <div className="control">
      <label className="checkbox p-3">
        <input
          type="checkbox"
          id={name}
          name={name}
          value={value}
          checked={checked}
          onChange={() => setChecked(prev => !prev)}
          disabled={disabled}
        ></input>
      </label>
      <label htmlFor={value.toString()}>{name}</label>
    </div>
  );
}
