import * as yup from 'yup';

const REGEX_PASSWORD = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z_.\-@]{6,}$/;
const REGEX_ONLY_NUMBER = /^\d+$/;

// eslint-disable-next-line func-names
yup.addMethod(yup.string, 'password', function (message) {
  return this.matches(
    REGEX_PASSWORD,
    {
      message,
      excludeEmptyString: true,
    }
  );
});
// eslint-disable-next-line func-names
yup.addMethod(yup.string, 'onlyNumber', function (
  message
) {
  return this.matches(REGEX_ONLY_NUMBER, {
    message,
    excludeEmptyString: true,
  });
}
);

export default yup;
