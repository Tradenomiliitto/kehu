const addKehuSchema = {
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

const sendKehuSchema = {
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
  receiver_name: {
    errorMessage: "Kehun saajan nimi on pakollinen tieto.",
    custom: {
      options: value => {
        return !!value;
      }
    }
  },
  receiver_email: {
    errorMessage: "Kehun saajan sähköpostiosoite on pakollinen tieto.",
    custom: {
      options: value => {
        return !!value;
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

const updateReceivedKehuSchema = {
  giver_id: {
    errorMessage: "Kehun antajan tunnus puuttuu tai on virheellinen.",
    exists: true,
    isInt: true,
    toInt: true,
    custom: {
      options: (value, { req }) => {
        return value && value !== req.user.id;
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
  }
};

module.exports = {
  addKehuSchema,
  sendKehuSchema,
  updateReceivedKehuSchema
};
