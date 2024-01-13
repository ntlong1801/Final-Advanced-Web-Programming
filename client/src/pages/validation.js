import yup from '../yupGlobal';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const checkSignUp = yup.object().shape({
  password: yup
    .string()
    .required('Required')
    .password('Password invalid'),
  email: yup.string().email('Email is invalid'),
});

export const checkChangeProfile = yup.object().shape({
  email: yup.string().email('Email is invalid'),
});

export const checkPhoneNumber = yup.object().shape({
  phoneNumber: yup.string().matches(phoneRegExp, 'Phone number is not valid')
});

export const checkClassName = yup.object().shape({
  name: yup.string().required(),
});

export const checkStudentId = yup.object().shape({
  studentId: yup.string().required(),
});

export default checkSignUp;
