import {
    validateString,
    validateEmail,
    validatePassword,
    validateCreditCardNumber,
    validateExpiryDate,
    validateCVV
} from '../ValidationConstraints';

export const validateInput = (inputId, inputValue, role) => {
    let validationResult;

    if (role === 'teacher' && inputId === 'grade') {
        return null;
    }

    if (
        inputId === 'fullName' ||
        inputId === 'location' ||
        inputId === 'userName' ||
        inputId === 'phoneNumber' ||
        inputId === 'creditCardHolderName' ||
        inputId === 'bio' ||
        inputId === 'address' ||
        inputId === 'street' ||
        inputId === 'postalCode' ||
        inputId === 'appartment' ||
        inputId === 'nickname' ||
        inputId === 'link' || 
        inputId === "occupation" ||
        inputId === 'currentLocation' ||
        inputId === "destination" ||
        inputId === 'gender' ||      
        inputId === 'age' ||         
        inputId === 'grade' ||  
        inputId === 'birthday'      
    ) {
        validationResult = validateString(inputId, inputValue);
    } else if (inputId === 'email' || inputId === 'newEmail') {
        validationResult = validateEmail(inputId, inputValue);
    } else if (inputId === 'password' || inputId === 'confirmPassword' || inputId === 'newPassword' || inputId === 'confirmNewPassword') {
        validationResult = validatePassword(inputId, inputValue);
    } else if (inputId === 'resetToken') {
        validationResult = validateString(inputId, inputValue);
    } else if (inputId === 'creditCardNumber') {
        validationResult = validateCreditCardNumber(inputId, inputValue);
    } else if (inputId === 'creditCardExpiryDate') {
        validationResult = validateExpiryDate(inputId, inputValue);
    } else if (inputId === 'cvv') {
        validationResult = validateCVV(inputId, inputValue);
    } else {
        validationResult = null;
    }

    return validationResult ? validationResult.join(', ') : null;
}