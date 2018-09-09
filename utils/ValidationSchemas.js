const kehuSchema = {
  date_given: {
    errorMessage: "Ajankohta on pakollinen tieto.",
    custom: {
      options: value => {
        return !!value;
      }
    }
  },
  giver_id: {
    errorMessage: "Kehun antajan tunnus puuttuu tai on virheellinen.",
    exists: true,
    isInt: true,
    toInt: true,
    custom: {
      options: (value, { req }) => {
        return value === req.user.id;
      }
    }
  },
  giver_name: {
    errorMessage: "Kehun antaja on pakollinen tieto.",
    custom: {
      options: value => {
        return !!value;
      }
    }
  },
  situation: {
    errorMessage: "Tilanne on pakollinen tieto.",
    custom: {
      options: value => {
        return !!value;
      }
    }
  },
  owner_id: {
    errorMessage: "Kehun omistajan tunnus puuttuu tai on virheellinen.",
    isInt: true,
    toInt: true,
    custom: {
      options: (value, { req }) => {
        return value === req.user.id;
      }
    }
  },
  text: {
    errorMessage: "Teksti on pakollinen tieto.",
    custom: {
      options: value => {
        return !!value;
      }
    }
  }
};

module.exports = {
  kehuSchema
};
