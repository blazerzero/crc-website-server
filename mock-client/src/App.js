/** @jsx jsx */
import { jsx } from '@emotion/core'
import {useState} from 'react'
//import { Grid, TextField, Button } from '@material-ui/core'
import { Alert, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import axios from 'axios';

const App = () => {
  const [name, setName] = useState('')
  const [isValidName, setIsValidName] = useState(true)
  const [email, setEmail] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [phone, setPhone] = useState('')
  const [isValidPhone, setIsValidPhone] = useState(true)
  const [role, setRole] = useState('')
  const [isValidRole, setIsValidRole] = useState(true)
  const [type, setType] = useState('')
  const [isValidType, setIsValidType] = useState(true)

  /* Emergency Professional-Specific Fields */
  const [title, setTitle] = useState('')
  const [isValidTitle, setIsValidTitle] = useState(true)
  const [agency, setAgency] = useState('')
  const [isValidAgency, setIsValidAgency] = useState(true)
  const [jurisdiction, setJurisdiction] = useState('')
  const [isValidJurisdiction, setIsValidJurisdiction] = useState(true)

  /* Grocery-Specific Fields */
  const [items, setItems] = useState('')
  const [isValidItems, setIsValidItems] = useState(true)
  const [allergies, setAllergies] = useState('')

  /* Funds-Specific Fields */
  const [amount, setAmount] = useState(0.00)
  const [isValidAmount, setIsValidAmount] = useState(true)
  const [reason, setReason] = useState('')
  const [isValidReason, setIsValidReason] = useState(true)

  /* In-Home Services-Specific Fields */
  const [inHomeType, setInHomeType] = useState('')
  const [isValidInHomeType, setIsValidInHomeType] = useState(true)

  /* Used By Both In-Home Services and Pet Services */
  const [frequency, setFrequency] = useState('ONE TIME')

  /* Used By In-Home Services, Pet Services, and Other */
  const [description, setDescription] = useState('')
  const [isValidDescription, setIsValidDescription] = useState(true)

  /* Universal Fields */
  const [isNeededBy, setIsNeededBy] = useState(false)
  const [neededByDate, setNeededByDate] = useState(new Date())
  const [isValidIsNeededByDate, setIsValidNeededByDate] = useState(true)
  const [isPublic, setIsPublic] = useState(true)
  const [additionalInfo, setAdditionalInfo] = useState('')

  const [validated, setValidated] = useState(false);
  const [validForm, setValidForm] = useState(true);

  const isValid = () => {
    if (name === '' || email === '' || role === '' || type === '') {
      setIsValidName(name !== '')
      setIsValidEmail(email !== '')
      setIsValidRole(role !== '')
      setIsValidType(type !== '')
      return false;
    }
    if (role === 'EM PROF' && (title === '' || agency === '' || jurisdiction === '')) {
      setIsValidTitle(title !== '')
      setIsValidAgency(agency !== '')
      setIsValidJurisdiction(jurisdiction !== '')
      return false;
    }
    if (type === 'GROCERY' && items === '') {
      setIsValidItems(items !== '')
      return false;
    }
    if (type === 'FUNDS' && (amount <= 0 || reason === '')) {
      setIsValidAmount(amount > 0)
      setIsValidReason(reason !== '')
      return false;
    }
    if (type === 'IN HOME' && (inHomeType === '' || description === '')) {
      setIsValidInHomeType(inHomeType !== '')
      setIsValidDescription(description !== '')
    }
    if ((type === 'PETS' || type === 'OTHER') && description === '') {
      setIsValidDescription(description !== '')
    }

    setValidForm(true);
    return true;
  }

  const handleSubmit = async(e) => {
    const form = e.currentTarget;
    if (!isValid()) {
      setValidForm(false);
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);
    let data = {
      name,
      region: 'ALBANY CORVALLIS PHILOMATH',   // until more regions are supported
      role,
      title: title === '' ? 'N/A' : title,
      agency: agency === '' ? 'N/A' : agency,
      jurisdiction: jurisdiction === '' ? 'N/A' : jurisdiction,
      email,
      type,
      neededBy: neededByDate,
      public: isPublic
    }
    if (type === 'GROCERY') {
      data.details = {
        items,
        allergies,
        additionalInfo,
      }
    } else if (type === 'FUNDS') {
      data.details = {
        amount,
        reason,
        additionalInfo,
      }
    } else if (type === 'IN HOME') {
      data.details = {
        serviceType: inHomeType,
        description,
        frequency,
        additionalInfo,
      }
    } else if (type === 'PETS') {
      data.details = {
        description,
        frequency,
        additionalInfo,
      }
    } else if (type === 'OTHER') {
      data.details = {
        description,
        additionalInfo,
      }
    } else {
      data.details = null
    }
    axios.post('157.245.162.43:5000/request/create', data)
      .then((response) => {
        alert(response.data.msg);
      })
      .catch((error) => {
        console.log(error);
        alert('We\'re sorry! We encountered an issue saving your request! Please try again soon or email us at crcpnw@gmail.com.');
      });
  }

  return (
    <div style={{width: '60%', margin: '0 auto'}}>
      <h2 style={{textAlign: 'center'}}>API Test Form: Submit a Request</h2>
      <div style={{padding: '1em', textAlign: 'center'}}>
        <small>DISCLAIMER: At this time, the CRC is only able to fulfill requests for Linn and Benton counties in Oregon. We are actively working on our ability to fulfill requests in other regions of the Pacific Northwest!</small>
      </div>
      <Form validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId='rrName'>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id='rfNAmePrepend'>
                Name:
                <sup style={{color: 'red', fontWeight: 'bold'}}>*</sup>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              required
              type='text'
              placeholder='E.g. John Doe'
              label='firstname'
              onChange={e => setName(e.target.value)}/>
          </InputGroup>
          <Form.Control.Feedback type='invalid'>
            Please enter your name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Row>
          <Col>
            <Form.Group controlId='rfEmail'>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id='rfEmailPrepend'>
                    Email:
                    <sup style={{color: 'red', fontWeight: 'bold'}}>*</sup>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  required
                  type='email'
                  placeholder='E.g. me@example.com'
                  label='email'
                  onChange={e => setEmail(e.targetValue)}/>
              </InputGroup>
              <Form.Control.Feedback type='invalid'>
                Please enter a valid email address.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId='rfPhone'>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id='rfPhonePrepend'>
                    Phone:
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  placeholder='E.g. (541) 555-5555'
                  label='phone'
                  onChange={e => setPhone(e.target.value)}/>
              </InputGroup>
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Group controlId='rfRole'>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id='rfRolePrepend'>
                I am a:
                <sup style={{color: 'red', fontWeight: 'bold'}}>*</sup>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              required
              as='select'
              label='role'
              defaultValue=''
              onChange={e => setRole(e.target.value)}>
              <option value=''>Select one...</option>
              <option value='COMM MEMBER'>Community Member</option>
              <option value='EM PROF'>Emergency Professional</option>
            </Form.Control>
          </InputGroup>
          <Form.Control.Feedback type='invalid'>
            Please select one.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId='rfType'>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id='rfTypePrepend'>
                I need help with:
                <sup style={{color: 'red', fontWeight: 'bold'}}>*</sup>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              required
              as='select'
              label='type'
              defaultValue=''
              onChange={e => setType(e.target.value)}>
              <option value=''>Select one...</option>
              <option value='GROCERY'>Food/Groceries</option>
              <option value='FUNDS'>Funds</option>
              <option value='IN HOME'>In-Home Services</option>
              <option value='PETS'>Pet Services</option>
              <option value='OTHER'>Other (Please Describe)</option>
            </Form.Control>
          </InputGroup>
          <Form.Control.Feedback type='invalid'>
            Please select a request type.
          </Form.Control.Feedback>
        </Form.Group>
        {type === 'GROCERY' && (
          <div>
            <Form.Group controlId='rfGroceryList'>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id='rfGroceryListPrepend'>
                    Grocery List:
                    <sup style={{color: 'red', fontWeight: 'bold'}}>*</sup>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  required
                  as='textarea'
                  placeholder='E.g. 1% milk (2), Sourdough bread (1 loaf)'
                  label='grocery_list'
                  onChange={e => setItems(e.target.value)}/>
              </InputGroup>
              <Form.Control.Feedback type='invalid'>
                Please enter your grocery list.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='rfAllergies'>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id='rfAllergiesPrepend'>
                    Allergies:
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  as='textarea'
                  placeholder='E.g. peanuts'
                  label='allergies'
                  onChange={e => setAllergies(e.target.value)}/>
              </InputGroup>
            </Form.Group>
          </div>
        )}
        {type === 'FUNDS' && (
          <div>
            <Form.Group controlId='rfFundAmount'>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id='rfFundAmountPrepend'>
                    How much do you need?
                    <sup style={{color: 'red', fontWeight: 'bold'}}>*</sup>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <InputGroup.Prepend>
                  <InputGroup.Text id='rfFundDollarPrepend'>
                    $
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type='number'
                  placeholder='E.g. 100, 49.50'
                  label='amount'
                  onChange={e => setAmount(e.target.value)}/>
              </InputGroup>
            </Form.Group>
            <Form.Group controlId='rfFundReason'>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id='rfFundReasonPrepend'>
                    What do you need the funds for?:
                    <sup style={{color: 'red', fontWeight: 'bold'}}>*</sup>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  required
                  as='textarea'
                  placeholder='E.g. Rent, paying for utilities'
                  label='reason'
                  onChange={e => setReason(e.target.value)}/>
              </InputGroup>
              <Form.Control.Feedback type='invalid'>
                Please tell us why you need these funds.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        )}
        {type === 'IN HOME' && (
          <Form.Group controlId='rfInHomeServiceType'>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id='rfInHomeServiceTypePrepend'>
                  What kind of in-home request?:
                  <sup style={{color: 'red', fontWeight: 'bold'}}>*</sup>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                required
                as='select'
                label='type'
                defaultValue=''
                onChange={e => setType(e.target.value)}>
                <option value=''>Select one...</option>
                <option value='BABYSITTING'>Babysitting</option>
                <option value='ELDER CARE'>Elder Care</option>
                <option value='HOUSEKEEPING'>Housekeeping</option>
                <option value='OTHER'>Other (Please Describe)</option>
              </Form.Control>
            </InputGroup>
            <Form.Control.Feedback type='invalid'>
              Please select the type of service you need.
            </Form.Control.Feedback>
          </Form.Group>
        )}
        {(type === 'IN HOME' || type === 'PETS' || type === 'OTHER') && (
          <Form.Group controlId='rfDescription'>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id='rfDescriptionPrepend'>
                  Please describe the service you need.
                  <sup style={{color: 'red', fontWeight: 'bold'}}>*</sup>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                required
                as='textarea'
                placeholder='Type here...'
                label='description'
                onChange={e => setDescription(e.target.value)} />
            </InputGroup>
            <Form.Control.Feedback type='invalid'>
              Please describe the service you need.
            </Form.Control.Feedback>
          </Form.Group>
        )}
        {(type === 'IN HOME' || type === 'PETS') && (
          <div>
            <fieldset>
              <Form.Group as={Row} controlId='rfFrequency'>
                <Form.Label as='legend' column sm={3}>
                  Is this a one-time or recurring need?
                  <sup style={{color: 'red', fontWeight: 'bold'}}>*</sup>
                </Form.Label>
                <Col sm={9}>
                  <Form.Check
                    type='radio'
                    label='One-Time'
                    name='rfFrequencyRadios'
                    value='ONE TIME'
                    id='rfFrequencyOneTime'
                    checked
                    onSelect={e => setFrequency(e.target.value)} />
                  <Form.Check
                    type='radio'
                    label='Recurring'
                    name='rfFrequencyRadios'
                    value='RECURRING'
                    id='rfFrequencyRecurring'
                    onSelect={e => setFrequency(e.target.value)} />
                </Col>
              </Form.Group>
            </fieldset>
          </div>
        )}
        {type !== '' && (
          <div style={{paddingTop: '1em'}}>
            <Form.Group as={Row} controlId='rfNeededBy'>
              <Form.Label column sm={3}>
                Do you need this request fulfilled by a specific date?
              </Form.Label>
              <Col sm={3}>
                <Form.Check
                  label='Yes'
                  name='rfIsNeededByCheck'
                  id='rfIsNeededByCheck'
                  onChange={e => setIsNeededBy(!isNeededBy)} />
              </Col>
              {isNeededBy && (
                <Col sm={6}>
                  <Row>
                    <Form.Label column sm={3}>
                      Date:
                      <sup style={{color: 'red', fontWeight: 'bold'}}>*</sup>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        required
                        type='date'
                        label='neededByDate'
                        onChange={e => setNeededByDate(e.target.value)} />
                      <Form.Control.Feedback type='invalid'>
                        Please indicate when you need the service fulfilled by.
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                </Col>
              )}
              <Form.Control.Feedback type='invalid'>
                {neededByDate && 'Please specify when you need this request fulfilled by.'}
              </Form.Control.Feedback>
            </Form.Group>
            <fieldset>
              <Form.Group as={Row} controlId='rfPublic'>
                <Form.Label as='legend' column sm={3}>
                  Who would you like this request to be visible to?
                  <sup style={{color: 'red', fontWeight: 'bold'}}>*</sup>
                </Form.Label>
                <Col sm={9}>
                  <Form.Check
                    type='radio'
                    label='Everyone'
                    name='rfVisibilityRadios'
                    id='rfVisibilityEveryone'
                    checked
                    onCheck={e => setIsPublic(true)} />
                  <Form.Check
                    type='radio'
                    label='CRC Administrators Only'
                    name='rfVisibilityRadios'
                    id='rfVisibilityMods'
                    onCheck={e => setIsPublic(false)} />
                </Col>
              </Form.Group>
            </fieldset>
            <Form.Group controlId='rfAdditionalInfo'>
              <Form.Label>
                Please write anything else that you need us to know to best accommodate your request.
              </Form.Label>
              <Form.Control
                as='textarea'
                placeholder='Type here...'
                label='additionalInfo'
                onChange={e => setAdditionalInfo(e.target.value)} />
            </Form.Group>
          </div>
        )}
        <Button type='submit'>Submit Request</Button>
      </Form>
    </div>
    /*<Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <h2>API Test Form: Resource Request</h2>
      <form onSubmit={e => {
        e.preventDefault()

       fetch('http://0.0.0.0:5000/request/create', {
         method: 'POST',
         mode: 'cors',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           name: name,
           region: region,
           role: role,
           title: title,
           agency: agency,
           jurisdiction: jurisdiction,
           email: email,
           phone: phone,
           details: details
         })
       })
      }}>
        <div><TextField label="Name" onchange={e => setName(e.target.value)}/></div>
        <div><TextField label="Region" onchange={e => setRegion(e.target.value)}/></div>
        <div><TextField label="Role" onchange={e => setRole(e.target.value)}/></div>
        <div><TextField label="Title" onchange={e => setTitle(e.target.value)}/></div>
        <div><TextField label="Agency" onchange={e => setAgency(e.target.value)}/></div>
        <div><TextField label="Jurisdiction" onchange={e => setJurisdiction(e.target.value)}/></div>
        <div><TextField label="email" onchange={e => setEmail(e.target.value)}/></div>
        <div><TextField label="Phone" onchange={e => setPhone(e.target.value)}/></div>
        <div><TextField label="Details" onchange={e => setDetails(e.target.value)}/></div>
        <div><Button type="submit" variant="contained">Send</Button></div>
      </form>
    </Grid>*/
  )
}
export default App;
