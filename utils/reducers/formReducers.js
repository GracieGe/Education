export const reducer = (state, action) => {
    if (action.type !== 'FORM_INPUT_UPDATE') {
      return state;
    }
  
    const { validationResult, inputId, inputValue, role } = action;
  
    const updatedValues = {
      ...state.inputValues,
      [inputId]: inputValue,
    };
  
    const updatedValidities = {
      ...state.inputValidities,
      [inputId]: validationResult,
    };
  
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      if (role === 'student' || key !== 'grade') { 
        if (!updatedValidities[key]) {
          updatedFormIsValid = false;
          break;
        }
      }
    }
  
    return {
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid,
    };
  };