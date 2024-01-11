import { Controller, get } from 'react-hook-form';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import PropTypes from 'prop-types';
import { NON_PRINTABLE_REGEX } from 'components/constant';

export default function TextAreaInput({
  label,
  name,
  placeholder,
  isRequired,
  disabled,
  control,
  errors,
  autoFocus,
  errorMessage,
  rows,
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
            <InputTextarea
              id={name}
              placeholder={placeholder}
              onChange={(e) => {
                const formattedValue = e.target.value?.replace(NON_PRINTABLE_REGEX, '');
                onChange(formattedValue);
              }}
              value={value}
              autoFocus={autoFocus}
              ref={ref}
              rows={rows}
              className={classNames({ 'p-invalid': !!get(errors, name), 'surface-200': disabled })}
              // tooltip={get(errors, name)}
              tooltipOptions={{ position: 'bottom' }}
              disabled={disabled}
            />
          )}
        />

      </div>
      <span className="text-red-500">{errorMessage}</span>
    </div>
  );
}

TextAreaInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  errorMessage: PropTypes.string,
  rows: PropTypes.number,
  defaultValue: PropTypes.string
};

TextAreaInput.defaultProps = {
  label: '',
  placeholder: '',
  autoFocus: false,
  isRequired: false,
  disabled: false,
  errorMessage: '',
  rows: 3,
  defaultValue: '',
};
