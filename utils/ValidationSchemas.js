const addKehuSchema = {
  giver_id: {
    errorMessage: "Kehun antajan tunnus puuttuu tai on virheellinen.",
    exists: true,
    isInt: true,
    toInt: true,
    custom: {
      options: (value, { req }) => {
        return value === req.user.id;
      },
    },
  },
  giver_name: {
    errorMessage: "Kehun antaja on pakollinen tieto.",
    custom: {
      options: (value) => {
        return !!value;
      },
    },
  },
  owner_id: {
    errorMessage: "Kehun omistajan tunnus puuttuu tai on virheellinen.",
    isInt: true,
    toInt: true,
    custom: {
      options: (value, { req }) => {
        return value === req.user.id;
      },
    },
  },
  text: {
    errorMessage: "Teksti on pakollinen tieto.",
    custom: {
      options: (value) => {
        return !!value;
      },
    },
  },
};

const sendKehuSchema = {
  receiver_name: {
    errorMessage: "Kehun saajan nimi on pakollinen tieto.",
    trim: true,
    custom: {
      options: (value) => {
        return !!value;
      },
    },
  },
  receiver_email: {
    errorMessage: "Kehun saajan sähköpostiosoite on pakollinen tieto.",
    isEmail: true,
    trim: true,
    custom: {
      options: (value) => {
        return !!value;
      },
    },
  },
  text: {
    errorMessage: "Teksti on pakollinen tieto.",
    custom: {
      options: (value) => {
        return !!value;
      },
    },
  },
};

const sendGroupKehuSchema = {
  receiver_name: {
    isString: true,
    notEmpty: true,
    trim: true,
    errorMessage: "Kehun saajan nimi on pakollinen tieto.",
  },
  receiver_email: {
    isEmail: true,
    notEmpty: true,
    trim: true,
    optional: { options: { nullable: true } },
    errorMessage: "Kehun saajan sähköpostiosoite on pakollinen tieto.",
  },
  date_given: {
    isString: true,
    notEmpty: true,
    errorMessage: "date_given must be nonempty string",
  },
  group_id: {
    isInt: true,
    errorMessage: "Yhteisön tunniste on pakollinen tieto.",
  },
  is_public: {
    isBoolean: true,
    errorMessage: "Kehun julkisuus on pakollinen tieto.",
  },
  role_id: {
    isInt: true,
    optional: { options: { nullable: true } },
    errorMessage: "role_id must be an integer",
  },
  situations: {
    isArray: true,
    errorMessage: "situations must be an array",
  },
  tags: {
    isArray: true,
    errorMessage: "tags must be an array",
  },
  text: {
    isString: true,
    notEmpty: true,
    trim: true,
    errorMessage: "Teksti on pakollinen tieto.",
  },
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
      },
    },
  },
  owner_id: {
    errorMessage: "Kehun omistajan tunnus puuttuu tai on virheellinen.",
    isInt: true,
    toInt: true,
    custom: {
      options: (value, { req }) => {
        return value === req.user.id;
      },
    },
  },
};

const updateProfileSchema = {
  first_name: {
    errorMessage: "Etunimi on pakollinen tieto.",
    trim: true,
    custom: {
      options: (value) => {
        return !!value;
      },
    },
  },
  last_name: {
    errorMessage: "Sukunimi on pakollinen tieto.",
    trim: true,
    custom: {
      options: (value) => {
        return !!value;
      },
    },
  },
  email: {
    errorMessage: "Sähköpostiosoite on pakollinen tieto.",
    isEmail: true,
    trim: true,
    custom: {
      options: (value) => {
        return !!value;
      },
    },
  },
};

const createGroupSchema = {
  name: {
    isString: true,
    notEmpty: true,
    errorMessage: "Ryhmän nimi on pakollinen tieto.",
    trim: true,
  },
  description: {
    isString: true,
    optional: true,
    errorMessage: "Ryhmän kuvaus ei ole pakollinen tieto.",
    trim: true,
  },
  picture: {
    isString: true,
    notEmpty: true,
    errorMessage: "Ryhmän kuva on pakollinen tieto.",
    trim: true,
  },
  cloudinaryPublicId: {
    isString: true,
    notEmpty: true,
    optional: true,
    errorMessage: "Cloudinary-kuvan id on oltava ei-tyhjä merkkijono.",
  },
  members: {
    isArray: true,
    errorMessage: "Ryhmän jäsenet ovat pakollinen tieto.",
  },
};

const updateGroupNameSchema = {
  name: {
    isString: true,
    optional: true,
    trim: true,
  },
  description: {
    isString: true,
    optional: true,
    trim: true,
  },
};

module.exports = {
  addKehuSchema,
  sendKehuSchema,
  sendGroupKehuSchema,
  updateReceivedKehuSchema,
  updateProfileSchema,
  createGroupSchema,
  updateGroupNameSchema,
};
