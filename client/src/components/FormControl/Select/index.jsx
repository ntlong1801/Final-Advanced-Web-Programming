import { Controller, get } from 'react-hook-form';

import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function Select({
  label,
  name,
  options,
  inputField,
  renderField,
  placeholder,
  isRequired,
  disabled,
  control,
  errors,
  onSelectChange,
  onSelectRemove,
  isFontWeightLabel,
}) {
  const { t } = useTranslation();
  return (
    <div className="field">
      <label
        className={classNames('mb-2', { hidden: !label, 'inline-block': label })}
        style={isFontWeightLabel ? { fontWeight: 900 } : {}}
        htmlFor={name}
      >
        {label}{' '}
        {isRequired && (
          <span className="text-red-500" style={{ fontWeight: 900 }}>
            *
          </span>
        )}
      </label>
      <Controller
        control={control}
        defaultValue={undefined}
        name={name}
        render={({ field: { onChange, value, ref } }) => (
          <div className="relative">
            <Dropdown
              value={value}
              onChange={(e) => {
                onChange(e.value);
                onSelectChange(name, e.value);
              }}
              options={options}
              optionValue={inputField}
              optionLabel={renderField}
              inputRef={ref}
              placeholder={placeholder}
              dropdownIcon={disabled ? '' : 'pi pi-chevron-down'}
              className={classNames({ 'p-invalid': !!get(errors, name), 'surface-200': disabled })}
              tooltip={t(get(errors, name)?.message)}
              tooltipOptions={{ position: 'bottom' }}
              disabled={disabled}
            />
            {!disabled && value?.toString() && (
              <i
                onClick={() => {
                  onChange(typeof value === 'string' ? '' : undefined);
                  onSelectRemove(name);
                }}
                className="pi pi-times absolute text-red-700 cursor-pointer"
                style={{ right: 40, top: 14 }}
              />
            )}
          </div>
        )}
      />
    </div>
  );
}

Select.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.array.isRequired,
  inputField: PropTypes.string,
  renderField: PropTypes.string,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  onSelectChange: PropTypes.func,
  onSelectRemove: PropTypes.func,
  isFontWeightLabel: PropTypes.bool,
};

Select.defaultProps = {
  label: '',
  placeholder: '',
  inputField: 'id',
  renderField: 'name',
  isRequired: false,
  disabled: false,
  onSelectChange: () => null,
  onSelectRemove: () => null,
  isFontWeightLabel: false,
};
