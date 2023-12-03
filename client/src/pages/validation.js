import yup from '../yupGlobal';

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

export default checkSignUp;
