/**
 *
 * @param payload
 * @param schema
 * @param groupErrorsByPath
 * @param options
 * @returns {{isValid: boolean, error: {}}|{isValid: boolean, error: string}|{isValid: boolean, error: null}}
 */
export const validate = (payload, schema, { groupErrorsByPath, ...options } = {}) => {
  const { error } = schema.validate(payload, { abortEarly: false, ...options });

  if (error) {
    if (groupErrorsByPath) {
      return {
        isValid: false,
        error: error.details.reduce((acc, err) => {
          const { path, message } = err;
          if (!acc[path]) {
            acc[path] = [];
          }
          acc[path].push(message);
          return acc;
        }, {}),
      };
    }
    return {
      isValid: false,
      error: error.details.map((x) => x.message).join(', '),
    };
  }
  return { isValid: true, error: null };
};
