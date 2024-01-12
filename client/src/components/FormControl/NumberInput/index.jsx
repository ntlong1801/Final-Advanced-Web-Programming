import { Controller, get } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import PropTypes from 'prop-types';

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
          render={({ field: { onChange, value, ref } }) => (
            <InputNumber
              inputId={name}
              value={value}
              onValueChange={(e) => onChange(e.value ?? 0)}
              placeholder={placeholder}
              autoFocus={autoFocus}
              ref={ref}
              className={classNames({ 'p-invalid': !!get(errors, name), 'surface-200': disabled })}
              tooltipOptions={{ position: 'bottom' }}
              min={0}
              max={10}
              maxFractionDigits={3}
              disabled={disabled}
              defaultValue={defaultValue}
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
  defaultValue: 0,
};
