export const useValidation = () => {
    const validateInputs = (teacherName, courseName) => {
        const MAX_INPUT_LENGTH = 255;
        const errors = {
          missingInput: "Both teacher name and course name are required.",
          inputTooLong: `Each input must be less than ${MAX_INPUT_LENGTH} characters long.`,
          emptyInput: "Inputs must not be empty.",
          invalidCharacters: "Inputs contain invalid characters."
        };
          if (!teacherName && !courseName) {
            return errors.missingInput;
          }
          if (teacherName.length > MAX_INPUT_LENGTH || courseName.length > MAX_INPUT_LENGTH) {
            return errors.inputTooLong;
          }
          if (!teacherName.trim() || !courseName.trim()) {
            return errors.emptyInput;
          }
          const whitelistPattern = /^[a-zA-Z0-9 _.,!:"'&/$()\u0590-\u05FF]+$/;
            // Function to find invalid characters
        const findInvalidCharacters = (input) => {
          return [...input].filter(character => !whitelistPattern.test(character));
        };
      
        // Check teacherName for invalid characters
        const invalidTeacherChars = findInvalidCharacters(teacherName);
        if (invalidTeacherChars.length > 0) {
          console.log('Validation Error: invalidCharacters in teacherName');
          console.log('Invalid characters:', invalidTeacherChars.join(' '));
          return errors.invalidCharacters;
        }
      
        // Check courseName for invalid characters
        const invalidCourseChars = findInvalidCharacters(courseName);
        if (invalidCourseChars.length > 0) {
          console.log('Validation Error: invalidCharacters in courseName');
          console.log('Invalid characters:', invalidCourseChars.join(' '));
          return errors.invalidCharacters;
        }
          return true;
        };
    return { validateInputs };
  };