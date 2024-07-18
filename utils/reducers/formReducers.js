export const reducer = (state, action) => {
    if (action.type !== 'FORM_INPUT_UPDATE') {
      return state;
    }
  
    const { validationResult, inputId, inputValue } = action;
  
    const updatedValues = {
      ...state.inputValues,
      [inputId]: inputValue,
    };
  
    const updatedValidities = {
      ...state.inputValidities,
      [inputId]: validationResult || null,  // 保存错误信息字符串或 null
    };
  
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      if (updatedValidities[key] !== null) {
        updatedFormIsValid = false;
        break;
      }
    }
  
    return {
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid,
    };
  };