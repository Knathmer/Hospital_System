import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

const DoctorForm = ({ doctor, onSubmit, onClose }) => {
  const initialValues = {
    firstName: doctor ? doctor.firstName : '',
    lastName: doctor ? doctor.lastName : '',
    gender: doctor ? doctor.gender : 'Male',
    dateOfBirth: doctor ? doctor.dateOfBirth : '',
    workPhoneNumber: doctor ? doctor.workPhoneNumber : '',
    workEmail: doctor ? doctor.workEmail : '',
    password: '',
    personalPhoneNumber: doctor ? doctor.personalPhoneNumber : '',
    personalEmail: doctor ? doctor.personalEmail : '',
    officeID: doctor ? doctor.officeID : '',
    addressID: doctor ? doctor.addressID : '',
    specialtyID: doctor ? doctor.specialtyID : '',
    Inactive: doctor ? doctor.Inactive : false,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required.'),
    lastName: Yup.string().required('Last name is required.'),
    workEmail: Yup.string().email('Invalid email format.').required('Work email is required.'),
    password: doctor
      ? Yup.string()
      : Yup.string().required('Password is required.').min(6, 'Password must be at least 6 characters.'),
    // Add more validations as needed
  });

  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, values, handleChange }) => (
        <Form>
          <h2 className="text-2xl font-bold mb-4">{doctor ? 'Edit Doctor' : 'Add Doctor'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block mb-1 font-semibold">First Name</label>
              <Field
                type="text"
                name="firstName"
                className="border rounded p-2 w-full"
              />
              <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Last Name */}
            <div>
              <label className="block mb-1 font-semibold">Last Name</label>
              <Field
                type="text"
                name="lastName"
                className="border rounded p-2 w-full"
              />
              <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Gender */}
            <div>
              <label className="block mb-1 font-semibold">Gender</label>
              <Field as="select" name="gender" className="border rounded p-2 w-full">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </Field>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block mb-1 font-semibold">Date of Birth</label>
              <Field
                type="date"
                name="dateOfBirth"
                className="border rounded p-2 w-full"
              />
            </div>

            {/* Work Phone Number */}
            <div>
              <label className="block mb-1 font-semibold">Work Phone Number</label>
              <Field
                type="text"
                name="workPhoneNumber"
                className="border rounded p-2 w-full"
              />
            </div>

            {/* Work Email */}
            <div>
              <label className="block mb-1 font-semibold">Work Email</label>
              <Field
                type="email"
                name="workEmail"
                className="border rounded p-2 w-full"
              />
              <ErrorMessage name="workEmail" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-semibold">Password</label>
              <Field
                type="password"
                name="password"
                className="border rounded p-2 w-full"
                placeholder={doctor ? 'Leave blank to keep existing password' : ''}
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Personal Phone Number */}
            <div>
              <label className="block mb-1 font-semibold">Personal Phone Number</label>
              <Field
                type="text"
                name="personalPhoneNumber"
                className="border rounded p-2 w-full"
              />
            </div>

            {/* Personal Email */}
            <div>
              <label className="block mb-1 font-semibold">Personal Email</label>
              <Field
                type="email"
                name="personalEmail"
                className="border rounded p-2 w-full"
              />
            </div>

            {/* Office ID */}
            <div>
              <label className="block mb-1 font-semibold">Office ID</label>
              <Field
                type="number"
                name="officeID"
                className="border rounded p-2 w-full"
              />
            </div>

            {/* Address ID */}
            <div>
              <label className="block mb-1 font-semibold">Address ID</label>
              <Field
                type="number"
                name="addressID"
                className="border rounded p-2 w-full"
              />
            </div>

            {/* Specialty ID */}
            <div>
              <label className="block mb-1 font-semibold">Specialty ID</label>
              <Field
                type="number"
                name="specialtyID"
                className="border rounded p-2 w-full"
              />
            </div>

            {/* Inactive */}
            <div className="flex items-center">
              <Field
                type="checkbox"
                name="Inactive"
                className="mr-2"
              />
              <label className="font-semibold">Inactive</label>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {doctor ? 'Update' : 'Add'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

DoctorForm.propTypes = {
  doctor: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    gender: PropTypes.string,
    dateOfBirth: PropTypes.string,
    workPhoneNumber: PropTypes.string,
    workEmail: PropTypes.string,
    personalPhoneNumber: PropTypes.string,
    personalEmail: PropTypes.string,
    officeID: PropTypes.number,
    addressID: PropTypes.number,
    specialtyID: PropTypes.number,
    Inactive: PropTypes.bool,
  }),
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DoctorForm;
