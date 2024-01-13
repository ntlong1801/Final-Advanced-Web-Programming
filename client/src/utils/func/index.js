const getClassCode = (link) => {
  const array = link.split('/');
  return array[array.length - 1];
};

export const findInputError = (errors, name) => {
  const filtered = Object.keys(errors)
    .filter((key) => key.includes(name))
    .reduce((cur, key) => Object.assign(cur, { errors: errors[key] }), {});
  return filtered;
};

export const isFormInvalid = (err) => {
  if (Object.keys(err).length > 0) return true;
  return false;
};

export default getClassCode;
