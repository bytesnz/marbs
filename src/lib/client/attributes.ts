export const parseAttributes = (attributes) => attributes.reduce((acc, attribute) => {
  const parts = attribute.split('=', 2);

  if (parts.length === 1) {
    acc[parts[0]] = true;
  } else {
    acc[parts[0]] = parts[1];
  }

  return acc;
}, {});
