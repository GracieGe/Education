export const reducer = (state, action) => {
    const { validationResult, inputId, inputValue } = action

    const updatedValues = {
        ...state.inputValues,
        [inputId]: inputValue,
    }

    const updatedValidities = {
        ...state.inputValidities,
        [inputId]: validationResult ? false : true, 
    }

    let updatedFormIsValid = true

    for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

    return {
        inputValues: updatedValues,
        inputValidities: updatedValidities,
        formIsValid: updatedFormIsValid,
    }
}