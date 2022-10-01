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
  giver_id: PropTypes.number.isRequired,
  is_public: PropTypes.bool.isRequired,
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
  situations: PropTypes.arrayOf(kehuSituationAndTagPropType),
  tags: PropTypes.arrayOf(kehuSituationAndTagPropType),
};
export const kehuPropType = PropTypes.shape(kehu);

const feedKehu = {
  ...kehu,
  isNewKehu: PropTypes.bool,
  giver: PropTypes.shape({
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
