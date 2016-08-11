import React from 'react'
import {render} from 'react-dom'

import {Form, Field, config} from 'hoth-form'

config.nonFieldErrorsKey = 'otherErrors';
config.fieldGroupClassName = /nested/;

const fields = {
  username: 'john',
  password1: {
    type: 'password',
    placeholder: 'Password'
  },
  password2: {
    label: 'Repeat password'
  },
  picture: {
    label: 'Your photo',
    type: 'file',
  },
  sex: {fields: ['male', 'female'], value: 'male'},
  skills: {fields: ['car', 'plane', 'boat']},
  pets: {
    fields: ['dog', 'cat', 'gremlin'],
    value: [],
    label: 'Pets',
    widget: 'select'
  },
  color: {
    fields: ['red', 'green', 'blue'], 
    value: 'blue',
    label: 'Favorite color', 
    widget: 'select'
  },
  agree: false
};

function validate(fields) {
  const errors = {};
  if (fields.username.value === 'mark') {
    errors.username = ['Not', 'this', 'time'];
  }
  if (fields.password1.value === 'rain') {
    errors.password1 = 'No more!';
  }
  if (!fields.agree.value) {
    errors.otherErrors = 'You must accept some terms'
  }
  return errors;
}

function onChange(fields, target = {}) {
  const changes = {};
  if (target.name === 'password1') {
    changes.password2 = {value: fields.password1.value};
  }
  if (target.name === 'password2') {
    changes.password1 = {value: fields.password2.value};
  }
  changes.skills = {fields: {boat: {disabled: true}}};
  changes.color = {fields: {green: {disabled: true}}};
  changes.pets = {fields: {gremlin: {disabled: true}}};
  return changes;
}

function submitButton(form) {
  return {
    disabled: form.errors
  }
}

function resetButton(form) {
  return {
    onClick: (e) => { form.reset(); e.preventDefault(); }
  }
}

const App = React.createClass({
  getInitialState: function() {
    return {
      moreErrors: {},
      submittedData: {}
    }
  },

  onSubmit: function(form) {
    this.setState({submittedData: form});
  },

  asyncCheck: function(form) {
    return {
      onBlur: () => {
        this.setState({checking: true});
        setTimeout(() => {
          if (form.fields.username.value === 'john') {
            this.setState({moreErrors: {username: 'Too many johnes!'}});
          } else {
            this.replaceState({moreErrors: {}});
          }
          this.setState({checking: false});
        }, 2000);
      },
      className: this.state.checking ? 'checking' : ''
    }
  },

  render: function() {
    return (
      <div id="demo">
        <Form fields={fields} validate={validate} onChange={onChange} onSubmit={this.onSubmit} moreErrors={this.state.moreErrors} ref="form">
          <h1>Kitchen sink</h1>
          <p className="hint">Try `john` (async validation) or `mark` (sync validation)</p>
          <Field name="username" label="Username" hoth={this.asyncCheck} />
          <p className="hint">Try `rain` (sync validation)</p>
          <Field name="password1" />
          <p className="hint">Value bound to `password1` in custom `onChange` in Form</p>          
          <Field name="password2" />
          <p className="hint">`file` input value is a `files` array</p>          
          <Field name="picture" />
          <p className="hint">Radioboxes</p>          
          <Field name="sex" value="male" type="radio" label="Male" />
          <Field name="sex" value="female" type="radio" label="Female" />
          <p className="hint">Rendering nested form elements by specifying className in parent container. Also, Injecting custom props into fields</p>          
          <fieldset className="nested">
            <legend>Driving skills:</legend>
            <Field name="skills" value="car" type="checkbox" label="Car" />
            <Field name="skills" value="plane" type="checkbox" label="Plane" />
            <Field name="skills" value="boat" type="checkbox" label="Boat" />
          </fieldset>
          <p className="hint">Multiple selection</p>          
          <Field name="pets" multiple>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="gremlin">Gremlin</option>
          </Field>
          <p className="hint">Single selection</p>          
          <Field name="color">
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
          </Field>
          <p className="hint">For single switches use `true/false` as `value`</p>          
          <Field name="agree" value={true} type="checkbox" label="Agree" />
          <p className="hint">Rendering non-field-errors with `null` widget</p>          
          <Field name="otherErrors" widget={null} />
          <p className="hint">Injecting `disabled` prop with `hoth`</p>          
          <Field hoth={submitButton} widget="button">Submit</Field>
          <p className="hint">Resetting form with `hoth`</p>          
          <Field hoth={resetButton} widget="button">Reset</Field>
        </Form>

        <div id="output">
          <h3>Submitted with:</h3>
          <div id="results">
            <pre>
              <code>
                {JSON.stringify(this.state.submittedData, null, 2)}
              </code>
            </pre>
          </div>
        </div>
      </div>
    )
  }
});

render(<App />, document.getElementById('root'));