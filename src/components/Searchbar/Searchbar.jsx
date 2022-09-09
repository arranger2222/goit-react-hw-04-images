import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { MdSearch } from 'react-icons/md';
import {
  SearchButton,
  SearchHeader,
  StyledForm,
  Input,
} from './Searchbar.styled';

export const Searchbar = ({ onSubmit }) => {
  const handleSubmit = async (values, actions) => {
    if (values.query.trim() === '') {
      toast.warn('Please specify your query!');
      return;
    }

    await onSubmit(values);
    actions.resetForm();
    actions.setSubmitting(false);
  };
  return (
    <SearchHeader className="header">
      <Formik initialValues={{ query: '' }} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <StyledForm>
            <SearchButton type="submit" disabled={isSubmitting}>
              <MdSearch style={{ width: 15, height: 15 }} />
            </SearchButton>
            <label>
              <Input
                name="query"
                type="text"
                autoComplete="off"
                placeholder="Search images and photos"
              ></Input>
            </label>
          </StyledForm>
        )}
      </Formik>
    </SearchHeader>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func,
};
