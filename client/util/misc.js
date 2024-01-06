// Sort members always in the same order: admins first, then by firstname,
// lastname, email and id

export function sortMembers(members) {
  return [...members].sort((a, b) => {
    const sortByAdminStatus = Number(b.is_admin) - Number(a.is_admin);
    const sortByFirstName = a.user.first_name.localeCompare(b.user.first_name);
    const sortByLastName = a.user.last_name.localeCompare(b.user.last_name);
    const sortByEmail = a.user.email.localeCompare(b.user.email);
    const sortById = a.user.id - b.user.id;

    // Return first non-zero value
    return (
      sortByAdminStatus ||
      sortByFirstName ||
      sortByLastName ||
      sortByEmail ||
      sortById
    );
  });
}

// Sort groups always in the same order: first the group with the latest sent
// kehu, then most recently joined group and finally by group id
export function sortGroups(groups) {
  return [...groups].sort((a, b) => {
    const sortByLatestKehu =
      new Date(getLatestKehu(b.kehus)?.date_given ?? 0) -
      new Date(getLatestKehu(a.kehus)?.date_given ?? 0);
    const sortByJoinedAt = new Date(b.joined_at) - new Date(a.joined_at);
    const sortById = a.id - b.id;

    // Return first non-zero value
    return sortByLatestKehu || sortByJoinedAt || sortById;
  });
}

// Get the most recent Kehu in the group
export function getLatestKehu(kehus) {
  return kehus.reduce(
    (prev, current) =>
      prev && new Date(prev.date_given) > new Date(current.date_given)
        ? prev
        : current,
    null,
  );
}
