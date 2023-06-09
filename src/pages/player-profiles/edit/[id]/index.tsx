import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getPlayerProfileById, updatePlayerProfileById } from 'apiSdk/player-profiles';
import { Error } from 'components/error';
import { playerProfileValidationSchema } from 'validationSchema/player-profiles';
import { PlayerProfileInterface } from 'interfaces/player-profile';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function PlayerProfileEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlayerProfileInterface>(
    () => (id ? `/player-profiles/${id}` : null),
    () => getPlayerProfileById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PlayerProfileInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePlayerProfileById(id, values);
      mutate(updated);
      resetForm();
      router.push('/player-profiles');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PlayerProfileInterface>({
    initialValues: data,
    validationSchema: playerProfileValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Player Profile
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="notes" mb="4" isInvalid={!!formik.errors?.notes}>
              <FormLabel>Notes</FormLabel>
              <Input type="text" name="notes" value={formik.values?.notes} onChange={formik.handleChange} />
              {formik.errors.notes && <FormErrorMessage>{formik.errors?.notes}</FormErrorMessage>}
            </FormControl>
            <FormControl id="observations" mb="4" isInvalid={!!formik.errors?.observations}>
              <FormLabel>Observations</FormLabel>
              <Input
                type="text"
                name="observations"
                value={formik.values?.observations}
                onChange={formik.handleChange}
              />
              {formik.errors.observations && <FormErrorMessage>{formik.errors?.observations}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'player_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email as any}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'coach_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email as any}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'player_profile',
  operation: AccessOperationEnum.UPDATE,
})(PlayerProfileEditPage);
