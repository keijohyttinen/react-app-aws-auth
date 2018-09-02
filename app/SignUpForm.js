import React from 'react'
import { reduxForm } from 'redux-form'
//import { reduxForm } from 'redux-form/immutable'
import {
  ActionsContainer,
  Button,
  FieldsContainer,
  Fieldset,
  Form,
  FormGroup,
  Label,
} from 'react-native-clean-form'
import {
  Input,
  Select,
  Switch
//} from 'react-native-clean-form/redux-form-immutable'
} from 'react-native-clean-form/redux-form'
import { View,Text } from 'react-native'

import I18n from './i18n/i18n';


function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const FormView = props => {
  const { handleSubmit, isSubmitting, page } = props

  return (
    <Form>
      <FieldsContainer>
        <Fieldset label={I18n.t('loginMiddleTitle')}>
             <Input name="email" placeholder={I18n.t('namePlaceholder')} inlineLabel={false} autoCapitalize='none' keyboardType="email-address" returnKeyType="next" blurOnSubmit={false}/>
             <Input name="password"  placeholder={I18n.t('passwordPlaceholder')} inlineLabel={false} autoCapitalize='none' secureTextEntry={true} returnKeyType="next"/>
             <Input name="password_repeat" placeholder={I18n.t('passwordRepeatPlaceholder')} inlineLabel={false} autoCapitalize='none' secureTextEntry={true} />
        </Fieldset>
      </FieldsContainer>
      <ActionsContainer>
        <Button icon="md-checkmark" iconPlacement="right" onPress={handleSubmit} submitting={isSubmitting}>{I18n.t(page)}</Button>
      </ActionsContainer>
    </Form>
  )
}

//<Label>{I18n.t('emailLabel')}</Label>
//Label>{I18n.t('passwordLabel')}</Label>
//<Label>{I18n.t('passwordRepeatLabel')}</Label>

export default reduxForm({
  form: 'SignUpForm',
  validate: values => {
    const errors = {}

    //values = values.toJS()

    if (!values.email) {
      errors.email = I18n.t('emailIsRequired')
    }
    else if (!validateEmail(values.email)) {
      errors.email = I18n.t('invalid_email')
    }
    else if (!values.password) {
      errors.password = I18n.t('passwordIsRequired')
    }
    else if (!values.password_repeat) {
      errors.password_repeat = I18n.t('passwordRepeatIsRequired')
    }
    else if (values.password_repeat != values.password) {
      errors.password_repeat = I18n.t('passwordMismatch')
    }

    return errors
  }
})(FormView)
