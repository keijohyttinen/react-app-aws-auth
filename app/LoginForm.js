import React, { Component } from 'react'
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
} from 'react-native-clean-form/redux-form'

import I18n from './i18n/i18n';

function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

class FormView extends Component {
    render() {
        const { handleSubmit, isSubmitting, page} = this.props
        return (
            <Form>
              <FieldsContainer>
                <Fieldset label={I18n.t('loginMiddleTitle')} last>
                    <Input name="email" placeholder={I18n.t('namePlaceholder')} inlineLabel={false} autoCapitalize='none' keyboardType="email-address" returnKeyType="next" blurOnSubmit={false}/>
                    <Input name="password" placeholder={I18n.t('passwordPlaceholder')} inlineLabel={false} autoCapitalize='none' autoCorrect={false} secureTextEntry={true} />
                </Fieldset>
              </FieldsContainer>
              <ActionsContainer>
                <Button icon="md-checkmark" iconPlacement="right" onPress={handleSubmit} submitting={isSubmitting}>{I18n.t(page)}</Button>
              </ActionsContainer>
            </Form>
        );
    }
}

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

export default reduxForm({
  form: 'LoginForm',
  validate: values => {
    const errors = {};

    if (!values.email || values.email.isEmpty()) {
      errors.email = I18n.t('emailIsRequired');
    }
    else if (!validateEmail(values.email)) {
      errors.email = I18n.t('invalid_email');
    }

    /*else if (!values.password) {
      errors.password = I18n.t('passwordIsRequired');
  }*/

    return errors
  }
})(FormView)
