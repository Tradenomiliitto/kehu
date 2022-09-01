import PropTypes from "prop-types";

const role = {
  id: PropTypes.number.isRequired,
  role: PropTypes.string.isRequired,
  created_at: PropTypes.string,
  updated_at: PropTypes.string,
  imageId: PropTypes.string.isRequired,
};
export const rolePropType = PropTypes.shape(role);

const situation = {
  id: PropTypes.number.isRequired,
  test: PropTypes.string.isRequired,
  created_at: PropTypes.string,
  updated_at: PropTypes.string,
};
export const situationPropType = PropTypes.shape(situation);

const tag = situation;
export const tagPropType = PropTypes.shape(tag);

const kehu = {
  id: PropTypes.number.isRequired,
  giver_id: PropTypes.number.isRequired,
  giver_name: PropTypes.string.isRequired,
  owner_id: PropTypes.number,
  text: PropTypes.string.isRequired,
  created_at: PropTypes.string,
  updated_at: PropTypes.string,
  date_given: PropTypes.string,
  role_id: PropTypes.number,
  importance: PropTypes.number,
  comment: PropTypes.string,
  receiver_name: PropTypes.string,
  receiver_email: PropTypes.string,
  claim_id: PropTypes.string,
  date_owner_saw: PropTypes.string,
  group_id: PropTypes.number,
  is_public: PropTypes.bool.isRequired,
  role: PropTypes.shape(rolePropType),
  situations: PropTypes.arrayOf(PropTypes.shape(situationPropType)),
  tags: PropTypes.arrayOf(PropTypes.shape(tagPropType)),
};
export const kehuPropType = PropTypes.shape(kehu);

const sentKehu = {
  date_given: PropTypes.string,
  giver_name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  receiver_name: PropTypes.string,
  role_id: PropTypes.number,
  text: PropTypes.string.isRequired,
};
export const sentKehuPropType = PropTypes.shape(sentKehu);

const feedKehu = {
  ...kehuPropType,
  isNewKehu: PropTypes.bool,
  giver: PropTypes.shape({
    picture: PropTypes.string.isRequired,
  }),
};
export const feedKehuPropType = PropTypes.shape(feedKehu);

const feedSentKehu = {
  date_given: PropTypes.string,
  giver_name: PropTypes.string.isRequired,
  receiver_name: PropTypes.string,
  role_id: PropTypes.number,
  text: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
};
export const feedSentKehuPropType = PropTypes.shape(feedSentKehu);
