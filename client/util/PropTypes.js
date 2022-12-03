import PropTypes from "prop-types";

const role = {
  id: PropTypes.number.isRequired,
  role: PropTypes.string.isRequired,
  imageId: PropTypes.string.isRequired,
  created_at: PropTypes.string,
  updated_at: PropTypes.string,
};
export const rolePropType = PropTypes.shape(role);

const tag = {
  text: PropTypes.string.isRequired,
  count: PropTypes.number,
};
export const tagPropType = PropTypes.shape(tag);

const kehuSituationAndTag = {
  text: PropTypes.string.isRequired,
  id: PropTypes.number,
  created_at: PropTypes.string,
  updated_at: PropTypes.string,
};
export const kehuSituationAndTagPropType = PropTypes.shape(kehuSituationAndTag);

const sentKehu = {
  type: PropTypes.oneOf(["sent"]).isRequired,
  id: PropTypes.number.isRequired,
  giver_name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  date_given: PropTypes.string,
  receiver_name: PropTypes.string,
  role_id: PropTypes.number,
};
export const sentKehuPropType = PropTypes.shape(sentKehu);

const kehu = {
  ...sentKehu,
  type: PropTypes.oneOf(["added", "received"]).isRequired,
  giver_id: PropTypes.number.isRequired,
  is_public: PropTypes.bool,
  owner_id: PropTypes.number,
  created_at: PropTypes.string,
  updated_at: PropTypes.string,
  importance: PropTypes.number,
  comment: PropTypes.string,
  receiver_email: PropTypes.string,
  claim_id: PropTypes.string,
  date_owner_saw: PropTypes.string,
  group_id: PropTypes.number,
  role: rolePropType,
  situations: PropTypes.arrayOf(kehuSituationAndTagPropType).isRequired,
  tags: PropTypes.arrayOf(kehuSituationAndTagPropType).isRequired,
};
export const kehuPropType = PropTypes.shape(kehu);

const feedKehu = {
  ...kehu,
  type: PropTypes.oneOf(["added", "received", "others"]).isRequired,
  isNewKehu: PropTypes.bool,
  giver: PropTypes.shape({
    picture: PropTypes.string.isRequired,
  }).isRequired,
  // Owner information is only provided when the type is "others"
  owner: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }),
};
export const feedKehuPropType = PropTypes.shape(feedKehu);

const feedSentKehu = {
  ...sentKehu,
  id: undefined,
  picture: PropTypes.string.isRequired,
};
export const feedSentKehuPropType = PropTypes.shape(feedSentKehu);

const user = {
  id: PropTypes.number.isRequired,
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  picture: PropTypes.string,
};
export const userPropType = PropTypes.shape(user);

const group = {
  id: PropTypes.number.isRequired,
  description: PropTypes.string,
  is_admin: PropTypes.bool.isRequired,
  joined_at: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  kehus: PropTypes.arrayOf(kehuPropType).isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({ is_admin: PropTypes.bool, user: userPropType })
  ).isRequired,
};
export const groupPropType = PropTypes.shape(group);
