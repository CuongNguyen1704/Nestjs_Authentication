const buildEmailTemplate = (layout: string, dictionaries: Record<string, string | number>): string => {
  let _layout = layout;

  Object.keys(dictionaries).forEach((key) => {
    _layout = _layout.split(`{{${key}}}`).join(dictionaries[key].toString());
  });

  return _layout;
};

export default buildEmailTemplate;
