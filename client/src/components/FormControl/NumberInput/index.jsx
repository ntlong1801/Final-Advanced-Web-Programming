import { Controller, get } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import PropTypes from 'prop-types';
import { useState } from 'react';

export default function NumberInput({
  label,
  name,
  placeholder,
  isRequired,
  disabled,
  control,
  errors,
  autoFocus,
  errorMessage,
  defaultValue
}) {
  const [value, setValue] = useState(0);
  return (
    <div className="field text-input">
      {label && (
        <label htmlFor={name}>
          {label}{' '}
          {isRequired && (
            <span className="text-red-500" style={{ fontWeight: 900 }}>
              *
            </span>
          )}
        </label>
      )}
      <div>
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field: { onChange, ref } }) => (
            <InputNumber
              inputId={name}
              value={value}
              onValueChange={(e) => setValue(e.value)}
              placeholder={placeholder}
              onChange={(e) => {
                onChange(e.value);
              }}
              autoFocus={autoFocus}
              ref={ref}
              className={classNames({ 'p-invalid': !!get(errors, name), 'surface-200': disabled })}
              tooltipOptions={{ position: 'bottom' }}
              min={0}
              max={10}
              maxFractionDigits={3}
              disabled={disabled}
            />
          )}
        />

      </div>
      <span className="text-red-500">{errorMessage}</span>
    </div>
  );
}

NumberInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  errorMessage: PropTypes.string,
  defaultValue: PropTypes.string
};

NumberInput.defaultProps = {
  label: '',
  placeholder: '',
  autoFocus: false,
  isRequired: false,
  disabled: false,
  errorMessage: '',
  defaultValue: '',
};
