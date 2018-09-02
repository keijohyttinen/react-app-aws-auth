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


const FormView = props => {
  const { handleSubmit, isSubmitting} = props

  return (
    <Form>
      <FieldsContainer>
        <Fieldset label={I18n.t('passwordChangeFormTitle')}>
             <Input name="code" placeholder={I18n.t('codePlaceholder')} inlineLabel={false} autoCapitalize='none' keyboardType="numeric" returnKeyType="next" blurOnSubmit={false}/>
             <Input name="password"  placeholder={I18n.t('newPasswordPlaceholder')} inlineLabel={false} autoCapitalize='none' secureTextEntry={true} returnKeyType="next"/>
             <Input name="password_repeat" placeholder={I18n.t('newPasswordRepeatPlaceholder')} inlineLabel={false} autoCapitalize='none' secureTextEntry={true} />
        </Fieldset>
      </FieldsContainer>
      <ActionsContainer>
        <Button icon="md-checkmark" iconPlacement="right" onPress={handleSubmit} submitting={isSubmitting}>{I18n.t('confirmPasswordButtonText')}</Button>
      </ActionsContainer>
    </Form>
  )
}


export default reduxForm({
  form: 'ChangePasswordForm',
  validate: values => {
    const errors = {}

    //values = values.toJS()

    if (!values.code) {
      errors.code = I18n.t('codeIsRequired')
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
