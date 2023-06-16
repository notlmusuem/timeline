export function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

export function validatePhone(phone: string): boolean {
  const re = /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return re.test(phone);
}

/**
 * Performs a structuredClone on an object, but also copies over the prototype
 * by reference. This is important when cloning class instances.
 *
 * @param obj The object to clone
 * @returns The cloned object with the same prototype
 */
export function structuredCloneProto<T>(obj: T): T {
  const clone = structuredClone(obj);
  // structuredClone presently does not copy over prototypes, so we need to
  // copy them ourselves
  Object.setPrototypeOf(clone, Object.getPrototypeOf(obj));
  return clone;
}
