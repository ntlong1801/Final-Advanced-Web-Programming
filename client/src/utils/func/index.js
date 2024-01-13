const getClassCode = (link) => {
  const array = link.split('/');
  return array[array.length - 1];
};

export default getClassCode;
