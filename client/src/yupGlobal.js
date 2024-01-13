/* eslint-disable func-names */
import * as yup from 'yup';

const REGEX_PASSWORD = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z_.\-@]{6,}$/;
const REGEX_ONLY_NUMBER = /^\d+$/;
const REGEX_PHONE_NUMBER = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

yup.addMethod(yup.string, 'password', function (message) {
  return this.matches(
    REGEX_PASSWORD,
    {
      message,
      excludeEmptyString: true,
    }
  );
});

yup.addMethod(yup.string, 'onlyNumber', function (
  message
) {
  return this.matches(REGEX_ONLY_NUMBER, {
    message,
    excludeEmptyString: true,
  });
}
);

yup.addMethod(yup.string, 'phoneNumber', function (
  message
) {
  return this.matches(REGEX_PHONE_NUMBER, {
    message,
    excludeEmptyString: true,
  });
}
);

export default yup;
