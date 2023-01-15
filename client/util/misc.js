// Sort members always in the same order: admins first, then by firstname,
// lastname, email and id

export const sortMembers = (members) => {
  return [...members].sort((a, b) => {
    const sortByAdminStatus = Number(b.is_admin) - Number(a.is_admin);
    const sortByFirstName = a.user.first_name.localeCompare(b.user.first_name);
    const sortByLastName = a.user.last_name.localeCompare(b.user.last_name);
    const sortByEmail = a.user.email.localeCompare(b.user.email);
    const sortById = b.user.id - a.user.id;

    // Return first non-zero value
    return (
      sortByAdminStatus ||
      sortByFirstName ||
      sortByLastName ||
      sortByEmail ||
      sortById
    );
  });
};
